import { z } from 'zod';

export enum RegistrationStatus {
    Pending = 'pending',
    Approved = 'approved',
    Checked = 'checked',
    Denied = 'denied',
}

export enum Gender {
    Male = 'male',
    Female = 'female',
    Other = 'other',
}

export type Personal = z.infer<typeof personal>;
export const personal = z.object({
    /** User's first Name */
    firstName: z.string(),
    /** User's last Name */
    lastName: z.string(),
    // phone: z.string().optional(),

    /** User's age (at least 16) */
    age: z.number()
        .min(16, { message: 'You must be at least 16 years old to participate!'}),

    /** User's gender */
    gender: z.nativeEnum(Gender),
})


//* Education

export enum EducationYear {
    None = 'none',
    Highschool = 'highschool',

    Freshman = 'freshman',
    Sophomore = 'sophomore',
    Junior = 'junior',
    Senior = 'senior',

    Graduate = 'graduate',
    Masters = 'masters',
}

export type Education = z.infer<typeof education>;
export const education = z.object({
    /** Highest place of education */
    school: z.string(),
    /** Current level of education */
    year: z.nativeEnum(EducationYear),
    /** Major */
    major: z.string().optional(),
})


//* Event

export enum PreviousHackathons {
    None,
    One,
    Few,
    Many,
}

export enum DietaryRestrictions {
    None = 'none',
    Vegan = 'vegan',
    Vegetarian = 'vegetarian',
    Kosher = 'kosher',
    Gluten = 'gluten-free',
}

export const event = z.object({
    /** How many hackathons has the user attended before? */
    hackathons: z.nativeEnum(PreviousHackathons),
    /** Does the user have any dietary restrictions? */
    dietary: z.nativeEnum(DietaryRestrictions).default(DietaryRestrictions.None),
    /** Is the user allergic to anything? */
    allergies: z.string().optional(),
})



export type RegistrationData = z.infer<typeof registrationData>;
export const registrationData = z.object({
    /** User's status */
    status: z.nativeEnum(RegistrationStatus).default(RegistrationStatus.Pending),
})
    .merge(personal)
    .merge(education)
    .merge(event)