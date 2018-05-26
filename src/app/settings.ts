export type PlayScope = 'All' | 'Top 100' | 'Top 50' | 'Africa' | 'America' | 'Asia' | 'Europe' | 'Oceania';

export class Settings {
    playScope: PlayScope = 'All';
    showName = false;
    queryName = false;
    showCapital = false;
    queryCapital = false;
    showLocation = false;
    queryLocation = true;
    showFlag = true;
    queryFlag = false;
}
