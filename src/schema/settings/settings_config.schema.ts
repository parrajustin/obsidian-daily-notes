import { z } from "zod";
import { SchemaManager, type VersionedSchema } from "../schema";

const settingsConfigDataModelSchema = z.object({
    // Path to daily notes with replacement strings.
    dailyNotesPath: z.array(z.string()),
    // Templater daily notes file.
    dailyNotesTemplate: z.optional(z.string())
});

type SettingsConfigDataModel = z.infer<typeof settingsConfigDataModelSchema>;

export type Version0SettingsConfig = VersionedSchema<SettingsConfigDataModel, 0>;

const version0SettingsConfigZodSchema = settingsConfigDataModelSchema.extend({
    version: z.literal(0)
});

export type AnyVerionSettingsConfig = Version0SettingsConfig;

export type LatestSettingsConfigVersion = Version0SettingsConfig;

export const SETTINGS_CONFIG_SCHEMA_MANAGER = new SchemaManager<[Version0SettingsConfig], 0>(
    "Settings",
    [version0SettingsConfigZodSchema],
    [],
    () => {
        return {
            dailyNotesPath: [],
            dailyNotesTemplate: undefined,
            version: 0
        };
    }
);
