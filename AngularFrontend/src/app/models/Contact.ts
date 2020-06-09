import { Address } from './Address';
import { Phone } from './Phone';
import { Date } from './Date';
export interface Contact {

        contact_id?: number,
        first_name: string,
        middle_name?: string,
        last_name: string,
        addresses?: Address[],
        phones?: Phone[],
        dates?: Date[]

}