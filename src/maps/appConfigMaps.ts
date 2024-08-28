import { LangEnum } from "../enum/appConfigEnum";
import { LangModels } from "../models/appConfigModels";

export const langMaps: Map<LangEnum, LangModels> = new Map([
	[
		LangEnum["zh-CN"],
		{
			serverLang: LangEnum["zh-CN"],
		},
	],
	[
		LangEnum["en-US"],
		{
			serverLang: LangEnum["en-US"],
		},
	],
	[
		LangEnum["hi-IN"],
		{
			serverLang: LangEnum["hi-IN"],
		},
	],
	[
		LangEnum["id-ID"],
		{
			serverLang: LangEnum["id-ID"],
		},
	],
	[
		LangEnum["pt-BR"],
		{
			serverLang: LangEnum["pt-BR"],
		},
	],
]);
