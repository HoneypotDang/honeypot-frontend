import {
  CreateAndBrandingForm,
  LBP_TYPE,
  PRICE_TYPE,
  PROJECT_CATEGORY_TYPE,
  ProjectInfoForm,
  REVIEW_RIGHT,
  ReviewForm,
  SalesStructureForm,
  TermsAndConditionsForm,
  TokenomicsAndPreviewForm,
  TokenVestingForm,
} from "@/types/launch-project";
import { X } from "lucide-react";
import { z, ZodType } from "zod";

export const DEFAULT_LAUNCH_PROJECT_FORM = {
  // 1.Create and Branding
  ecosystem: "evm",
  targetNetwork: "berachain",
  connectedWalletNetwork: "eth",
  projectName: "",
  projectToken: "",
  projectTokenLogo: "",
  saleBanner: "",
  // 2.Sales Structure
  priceType: PRICE_TYPE.LBP,
  lbpType: undefined,
  startTime: new Date(),
  endTime: new Date(),
  tokenClaimDelayHours: 0,
  tokenClaimDelayMinutes: 0,
  tokenClaimDelay: new Date(),
  // 3.Tokenomics & Preview
  projectTokenQuantity: 0,
  assetTokenQuantity: 0,
  customTotalSupplyType: true,
  customTotalSupply: undefined,
  startWeight: 50,
  endWeight: 50,
  assetTokenType: "tHPOT",
  assetTokenName: "T-HPOT",
  assetTokenLogo: "/images/icons/tokens/thpot-token-icon.jpg",
  assetTokenAddress: "0xfc5e3743e9fac8bb60408797607352e24db7d65e",
  // 4.Token Vesting
  // isTokenVestingEnabled: true,
  // isVestingCliffTimeEnabled: true,
  // vestingCliffTime: new Date(),
  // vestingEndTime: new Date(),
  // 5.Project Info
  category: PROJECT_CATEGORY_TYPE.GAMING,
  lbpDescription: "",
  projectLink: "",
  // blockedCountry: [],
  // investmentRound: [],
  // 6.Socials & Community
  // 7.Review
  rights: [],
  // 8.Terms & Conditions
  isConfirmTerms: false,
};

export const createAndBrandingSchema: ZodType<CreateAndBrandingForm> = z.object(
  {
    ecosystem: z.string().min(1, "Ecosystem is required."),
    targetNetwork: z.string().min(1, "Target network is required."),
    connectedWalletNetwork: z
      .string()
      .min(1, "Connected wallet network is required."),
    projectName: z.string().min(1, "Project token is required."),
    projectToken: z
      .string()
      .min(1, "Project token is required.")
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address",
      }),
    projectTokenLogo: z.string().url("Project token logo must be a valid URL."),
    saleBanner: z.string().url("Sale banner must be a valid URL."),
  }
);

export const salesStructureSchema: ZodType<SalesStructureForm> = z
  .object({
    priceType: z.enum([PRICE_TYPE.LBP, PRICE_TYPE.FIXED]),
    lbpType: z.enum([LBP_TYPE.BUY_SELL, LBP_TYPE.SELL_ONLY]).optional(),
    startTime: z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Start time is required",
    }),
    endTime: z.date().refine((val) => !isNaN(val.getTime()), {
      message: "End time is required",
    }),
    tokenClaimDelayHours: z.number().optional(),
    tokenClaimDelayMinutes: z.number().optional(),
    tokenClaimDelay: z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Token claim delay is required",
    }),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  })
  .refine(
    (data) => {
      if (data.priceType === PRICE_TYPE.LBP) {
        return data.lbpType !== undefined;
      }
      return true;
    },
    {
      message: "LBP Type is required",
      path: ["lbpType"],
    }
  )
  .refine(
    (data) => {
      if (data.priceType === PRICE_TYPE.LBP) {
        return data.tokenClaimDelayHours !== undefined;
      }
      return true;
    },
    {
      message: "Token claim delay hours is required",
      path: ["tokenClaimDelayHours"],
    }
  )
  .refine(
    (data) => {
      if (data.priceType === PRICE_TYPE.LBP) {
        return data.tokenClaimDelayMinutes !== undefined;
      }
      return true;
    },
    {
      message: "Token claim delay hours is required",
      path: ["tokenClaimDelayMinutes"],
    }
  );

export const tokenomicsAndPreviewSchema: ZodType<TokenomicsAndPreviewForm> = z
  .object({
    projectTokenQuantity: z
      .number()
      .min(1, "Project token quantity is required"),
    assetTokenType: z.string().min(1, "Asset token type is required"),
    assetTokenName: z.string().min(1, "Asset token name is required"),
    assetTokenLogo: z.string().min(1, "Asset token logo is required"),
    assetTokenQuantity: z.number().min(1, "Asset token quantity is required"),
    customTotalSupplyType: z.boolean(),
    customTotalSupply: z.number().optional(),
    startWeight: z.number().min(1, "Start weight is required"),
    endWeight: z.number().min(1, "End weight is required"),
  })
  .refine(
    (data) => {
      if (data.customTotalSupplyType) {
        return data.customTotalSupply !== undefined;
      }
      return true;
    },
    {
      message: "Custom total supply is required",
      path: ["customTotalSupply"],
    }
  );

export const tokenVestingSchema: ZodType<TokenVestingForm> = z
  .object({
    isTokenVestingEnabled: z.boolean(),
    isVestingCliffTimeEnabled: z.boolean(),
    vestingCliffTime: z.date().optional(),
    vestingEndTime: z.date().optional(),
  })
  .refine(
    (data) => {
      if (data.isTokenVestingEnabled) {
        return data.vestingCliffTime !== undefined;
      }
      return true;
    },
    {
      message: "Vesting cliff time is required",
      path: ["vestingCliffTime"],
    }
  )
  .refine(
    (data) => {
      if (data.isTokenVestingEnabled) {
        return data.vestingEndTime !== undefined;
      }
      return true;
    },
    {
      message: "Vesting end time is required",
      path: ["vestingEndTime"],
    }
  )
  .refine(
    (data) => {
      if (
        data.isTokenVestingEnabled &&
        data.vestingCliffTime &&
        data.vestingEndTime
      ) {
        return data.vestingCliffTime < data.vestingEndTime;
      }
      return true;
    },
    {
      message: "Vesting end time must be after vesting cliff time",
      path: ["vestingEndTime"],
    }
  );

const investmentRoundSchema = z.object({
  raiseAmount: z.number().min(0, "Raise amount must be a positive number"),
  valuationOfRound: z
    .number()
    .min(0, "Valuation of round must be a positive number"),
  tgePercentage: z
    .number()
    .min(0)
    .max(100, "TGE percentage must be between 0 and 100"),
  supplySoldRound: z
    .number()
    .min(0, "Supply sold round must be a positive number"),
  vestingLengthTime: z
    .number()
    .min(0, "Vesting length time must be a positive number"),
});

export const projectInfoFormSchema: ZodType<ProjectInfoForm> = z.object({
  // category: z.enum([
  //   PROJECT_CATEGORY_TYPE.GAMING,
  //   PROJECT_CATEGORY_TYPE.CRYPTO,
  //   PROJECT_CATEGORY_TYPE.FINANCE,
  // ]),
  lbpDescription: z
    .string()
    .min(1, "LBP Description cannot be empty")
    .optional(),
  X: z.string().url("Invalid URL format").optional(),
  website: z.string().url("Invalid URL format").optional(),
  telegram: z.string().url("Invalid URL format").optional(),
  // blockedCountry: z.array(z.string()),
  // investmentRound: z.array(investmentRoundSchema),
});

// 6. Socials & Community
export const socialCommunitySchema = z.object({});

// 7. Review
const REVIEW_RIGHT_ZOD = z.enum([
  REVIEW_RIGHT.PAUSE_LBP,
  REVIEW_RIGHT.UNPAUSE_LBP,
]);
export const reviewSchema: ZodType<ReviewForm> = z.object({
  rights: z.array(REVIEW_RIGHT_ZOD),
});

// 8. Terms & Conditions
export const termsAndConditionsSchema: ZodType<TermsAndConditionsForm> =
  z.object({
    isConfirmTerms: z.boolean().refine((val) => val, {
      message: "You must confirm the terms and conditions",
    }),
  });

export const confirmationSchema = z.object({});
