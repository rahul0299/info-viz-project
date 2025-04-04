import {format, isAfter, parseISO, subDays, subHours} from "date-fns";

export const fetchData = async () => {
    console.log("Fetching data ...");
    return {
        "volumeTrendData": await fetchVolumeTrendData()
    };
}

export const fetchVolumeTrendData = async () => {
    const [res24h, res7d] = await Promise.all([
        fetch("/out/volume_trend_24h.json").then(res => res.json()),
        fetch("/out/volume_trend_7d.json").then(res => res.json())
    ]);

    // Simulate 1 second delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        "24h": res24h,
        "7d": res7d
    };

}

