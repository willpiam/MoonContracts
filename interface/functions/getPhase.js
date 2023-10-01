import { getLunarContract } from "./getContract.js";

const getPhase = async () => {
    const lunarContract = await getLunarContract();
    const phase = await lunarContract.currentPhase();
    console.log('Current phase:', phase)
    return phase;
}

export default getPhase;