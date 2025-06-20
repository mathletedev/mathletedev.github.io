import { JAMENDO_CLIENT_ID } from "./config";

const JAMENDO_API = "https://api.jamendo.com/v3.0";

export const getRandomTrack = async () => {
    const res = await fetch(
        `${JAMENDO_API}/tracks?client_id=${JAMENDO_CLIENT_ID}&search=synthwave&limit=20`,
    );

    const json = await res.json();

    return json.results[Math.floor(Math.random() * json.results.length)];
};

export const analyseTrack = async (track: any) => {};
