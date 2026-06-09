"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMarketOpen = isMarketOpen;
exports.getMarketStatus = getMarketStatus;
// US market hours in Eastern Time
const MARKET_OPEN_HOUR = 9;
const MARKET_OPEN_MINUTE = 30;
const MARKET_CLOSE_HOUR = 16;
const MARKET_CLOSE_MINUTE = 0;
// Returns a Date object representing a specific time today in US Eastern Time.
// We do this by constructing a string that the JS Date parser can interpret in ET.
function getETTime() {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
}
function isWeekend(date) {
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    return day === 0 || day === 6;
}
// Returns true if the current ET time falls within market hours (Mon–Fri, 9:30–16:00)
function isMarketOpen() {
    const etNow = getETTime();
    if (isWeekend(etNow))
        return false;
    const hours = etNow.getHours();
    const minutes = etNow.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const openMinutes = MARKET_OPEN_HOUR * 60 + MARKET_OPEN_MINUTE;
    const closeMinutes = MARKET_CLOSE_HOUR * 60 + MARKET_CLOSE_MINUTE;
    return totalMinutes >= openMinutes && totalMinutes < closeMinutes;
}
// Formats a duration (ms) into a human-readable string like "2h 34m" or "45m"
function formatDuration(ms) {
    const totalMinutes = Math.floor(ms / 1000 / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0)
        return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}
// Finds the next market open time as a UTC Date, accounting for weekends.
// E.g. if called on Friday after close, returns Monday 9:30 AM ET.
function getNextMarketOpen() {
    const etNow = getETTime();
    const candidate = new Date(etNow);
    // Set candidate to today's open time
    candidate.setHours(MARKET_OPEN_HOUR, MARKET_OPEN_MINUTE, 0, 0);
    // If we're already past today's open (or it's a weekend), roll forward
    if (candidate <= etNow || isWeekend(etNow)) {
        candidate.setDate(candidate.getDate() + 1);
        // Keep skipping until we hit a weekday
        while (isWeekend(candidate)) {
            candidate.setDate(candidate.getDate() + 1);
        }
        candidate.setHours(MARKET_OPEN_HOUR, MARKET_OPEN_MINUTE, 0, 0);
    }
    return candidate;
}
function getNextMarketClose() {
    const etNow = getETTime();
    const candidate = new Date(etNow);
    candidate.setHours(MARKET_CLOSE_HOUR, MARKET_CLOSE_MINUTE, 0, 0);
    return candidate;
}
// Main export — returns the full MarketStatus object for the API response
function getMarketStatus() {
    const etNow = getETTime();
    const open = isMarketOpen();
    if (open) {
        const closeTime = getNextMarketClose();
        const msUntilClose = closeTime.getTime() - etNow.getTime();
        return {
            isOpen: true,
            label: "Market Open",
            nextEventLabel: `Closes in ${formatDuration(msUntilClose)}`,
            nextEventTime: closeTime.toISOString(),
        };
    }
    else {
        const openTime = getNextMarketOpen();
        const msUntilOpen = openTime.getTime() - etNow.getTime();
        return {
            isOpen: false,
            label: "Market Closed",
            nextEventLabel: `Opens in ${formatDuration(msUntilOpen)}`,
            nextEventTime: openTime.toISOString(),
        };
    }
}
//# sourceMappingURL=marketHours.js.map