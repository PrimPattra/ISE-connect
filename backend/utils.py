def _to_camel(s: str) -> str:
    parts = s.split('_')
    return parts[0] + ''.join(p.capitalize() for p in parts[1:])


def camel_dict(obj):
    """Recursively convert all dict keys from snake_case to camelCase."""
    if isinstance(obj, dict):
        return {_to_camel(k): camel_dict(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [camel_dict(i) for i in obj]
    return obj
