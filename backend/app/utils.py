from datetime import datetime, timezone

def humanize_time_ago(dt: datetime) -> str:
    now = datetime.now(timezone.utc)
    delta = now - dt

    if delta.days >= 1:
        x = delta.days
        y = "day" if x <= 1 else "days"
    elif delta.seconds >= 3600:
        x = delta.seconds // 3600
        y = "hr" if x <= 1 else "hrs"
    elif delta.seconds >= 60:
        x = delta.seconds // 60
        y = "min" if x <= 1 else "mins"
    else:
        x = delta.seconds
        y = "sec" if x <= 1 else "secs"
    return f"{x} {y} ago"
