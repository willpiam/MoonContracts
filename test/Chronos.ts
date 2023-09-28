import { time } from "@nomicfoundation/hardhat-network-helpers";

const phases = [
    "New Moon",
    "Waxing Crescent",
    "First Quarter",
    "Waxing Gibbous",
    "Full Moon",
    "Waning Gibbous",
    "Last Quarter",
    "Waning Crescent",
]

export default class Chronos {
    lunar: any

    constructor(lunarContract: any) {
        this.lunar = lunarContract
    }

    async advanceOneDay() {
        await time.increase(60 * 60 * 24); // increase time by 1 day
    }

    private async advanceToPhase(phase: string) {
        let currentPhase = await this.lunar.currentPhase();

        while (currentPhase !== phase) {
            await time.increase(60 * 60 * 24); // increase time by 1 day
            currentPhase = await this.lunar.currentPhase();

            console.log(`Current phase: ${currentPhase}`);
        }
    }

    async advanceToNextFullMoon() {
        await this.advanceToPhase("Full Moon");
    }

    async advanceToNextPhase() {
        const currentPhase = await this.lunar.currentPhase();
        const currentPhaseIndex = phases.indexOf(currentPhase);
        const nextPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        const nextPhase : string = phases[nextPhaseIndex];
        await this.advanceToPhase(nextPhase);
    }

}