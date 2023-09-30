declare module 'csgo-sharecode' {
	export interface MatchInformation {
		matchId: bigint
		reservationId: bigint
		tvPort: number
	}
	export interface Crosshair {
		length: number
		red: number
		green: number
		blue: number
		gap: number
		alphaEnabled: boolean
		alpha: number
		outlineEnabled: boolean
		outline: number
		color: number
		thickness: number
		centerDotEnabled: boolean
		splitDistance: number
		followRecoil: boolean
		fixedCrosshairGap: number
		innerSplitAlpha: number
		outerSplitAlpha: number
		splitSizeRatio: number
		tStyleEnabled: boolean
		deployedWeaponGapEnabled: boolean
		/**
		 * CS:GO
		 * 0 => Default
		 * 1 => Default static
		 * 2 => Classic
		 * 3 => Classic dynamic
		 * 4 => Classic static
		 */
		/**
		 * CS2
		 * 0 to 3 => Classic
		 * 4 => Classic static
		 * 5 => Legacy
		 */
		style: number
	}
	export declare class InvalidShareCode extends Error {
		constructor()
	}
	export declare class InvalidCrosshairShareCode extends Error {
		constructor()
	}
	/**
	 * Match fields should come from a CDataGCCStrike15_v2_MatchInfo protobuf message.
	 * https://github.com/SteamDatabase/Protobufs/blob/master/csgo/cstrike15_gcmessages.proto (lookup for `CDataGCCStrike15_v2_MatchInfo`).
	 */
	export declare function encodeMatch({
		matchId,
		reservationId,
		tvPort,
	}: MatchInformation): string
	export declare function decodeMatchShareCode(
		shareCode: string
	): MatchInformation
	export declare function decodeCrosshairShareCode(
		shareCode: string
	): Crosshair
	export declare function encodeCrosshair(crosshair: Crosshair): string
	export declare function crosshairToConVars(crosshair: Crosshair): string
}
