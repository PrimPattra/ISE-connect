import { Icon } from '@/components/icon';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { TagPill } from '@/components/ui/tag-pill';
import { C, F } from '@/constants/theme';
import type { Applicant, ApplicantStatus, Job } from '@/types';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ApplicantRow } from './applicant-row';

const STAGES: ApplicantStatus[] = ['New', 'Reviewing', 'Interview', 'Hired', 'Pass'];

interface Props {
  job: Job;
  applicants: Applicant[];
  onMove: (id: string, status: ApplicantStatus) => void;
  onOpen: (a: Applicant) => void;
  onClose: (jid: string) => void;
  onEditOpen: (job: Job) => void;
  onPreview: (job: Job) => void;
}

export function RoleManageCard({ job, applicants, onMove, onOpen, onClose, onEditOpen, onPreview }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const grouped = STAGES.map(s => ({ stage: s, count: applicants.filter(a => a.status === s).length }));
  return (
    <Card style={s.card}>
      <View style={s.header}>
        <TouchableOpacity style={s.info} onPress={() => onPreview(job)} activeOpacity={0.7}>
          <View style={s.titleRow}>
            <Text style={s.title}>{job.title}</Text>
            <TagPill>{job.type}</TagPill>
            <TagPill>{job.location}</TagPill>
          </View>
          <Text style={s.meta}>{applicants.length} applicants · posted {job.posted}</Text>
        </TouchableOpacity>
        <View style={s.actions}>
          <TouchableOpacity style={s.smallBtn} onPress={() => onEditOpen(job)}>
            <Icon name="edit" size={13} color={C.ink2} />
            <Text style={s.smallBtnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.smallBtn} onPress={() => setConfirmOpen(true)}>
            <Icon name="x" size={13} color={C.ink2} />
            <Text style={s.smallBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Close role?"
        footer={
          <>
            <TouchableOpacity style={[btn.base, btn.ghost]} onPress={() => setConfirmOpen(false)}>
              <Text style={btn.ghostText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[btn.base, btn.danger]} onPress={() => { setConfirmOpen(false); onClose(job.id); }}>
              <Icon name="x" size={14} color={C.paper} />
              <Text style={btn.dangerText}>Close role</Text>
            </TouchableOpacity>
          </>
        }
      >
        <Text style={s.confirmText}>
          "{job.title}" will be removed from the board.{"\n"}This cannot be undone.
        </Text>
      </Modal>

      <View style={s.stages}>
        {grouped.map(g => (
          <View key={g.stage} style={s.stage}>
            <Text style={s.stageLabel}>{g.stage}</Text>
            <Text style={s.stageCount}>{g.count}</Text>
          </View>
        ))}
      </View>

      {applicants.length > 0
        ? <View style={s.applicants}>{applicants.map(a => <ApplicantRow key={a.id} a={a} onMove={onMove} onOpen={onOpen} />)}</View>
        : <View style={s.empty}><Text style={s.emptyText}>No applicants yet — role goes out in the next ISE digest.</Text></View>
      }
    </Card>
  );
}

const s = StyleSheet.create({
  card: { padding: 16, marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  info: { flex: 1 },
  titleRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 4 },
  title: { fontSize: 15, fontWeight: '500', color: C.ink },
  meta: { fontSize: 12, fontFamily: F.mono, color: C.muted },
  actions: { flexDirection: 'row', gap: 6 },
  smallBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: C.line, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  smallBtnText: { fontSize: 12, color: C.ink2 },
  stages: { flexDirection: 'row', gap: 6, marginBottom: 14 },
  stage: { flex: 1, borderWidth: 1, borderColor: C.line, borderRadius: 8, paddingVertical: 8, backgroundColor: C.paper2, alignItems: 'center' },
  stageLabel: { fontSize: 10, fontFamily: F.mono, color: C.muted, textTransform: 'uppercase' },
  stageCount: { fontSize: 18, color: C.ink, marginTop: 2 },
  applicants: {},
  empty: { borderWidth: 1, borderStyle: 'dashed', borderColor: C.line, borderRadius: 8, padding: 20, alignItems: 'center' },
  emptyText: { fontSize: 13, color: C.muted, textAlign: 'center' },
  confirmText: { fontSize: 14, color: C.muted, lineHeight: 22 },
});

const btn = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10 },
  ghost: { borderWidth: 1, borderColor: C.line },
  ghostText: { fontSize: 14, color: C.ink },
  danger: { backgroundColor: C.ink },
  dangerText: { fontSize: 14, color: C.paper, fontWeight: '500' },
});
