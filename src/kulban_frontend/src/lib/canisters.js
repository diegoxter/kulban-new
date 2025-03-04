import { createActor, canisterId } from "../../../declarations/kulban_backend";
import { building } from "$app/environment";

function dummyActor() {
	return new Proxy(
		{},
		{
			get() {
				throw new Error("Canister invoked while building");
			},
		},
	);
}

const buildingOrTesting =
	building || process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development";
export const canisterURL = buildingOrTesting ? `http://${canisterId}.raw.localhost:4943` : ``;
export const backend = buildingOrTesting ? dummyActor() : createActor(canisterId);
