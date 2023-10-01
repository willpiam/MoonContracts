import { getLunarContract , getLunarContractWithCustomProvider} from "./getContract.js";

const getPhase = async () => {
    console.log(`inside getPhase`)
    // const lunarContract = await getLunarContract();
    const lunarContract = await getLunarContractWithCustomProvider();
    const phase = await lunarContract.currentPhase();
    console.log('Current phase:', phase)
    return phase;
}

export default getPhase;