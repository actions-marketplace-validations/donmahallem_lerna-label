/*!
 * Source https://github.com/donmahallem/lerna-label
 */

import { getPackages } from '@lerna/project';

export interface IPackage {
    location: string;
    name: string;
    rootPath: string;
    scope?: string;
}

const packageRegex: RegExp = /^(@[a-z\d][\w\-.]+\/)?(.+)$/;
/** naïvely splits package name into optional scope and basename */
const parsePackageName = (name: string): {
    basename: string;
    scope?: string;
} => {
    const splits: RegExpMatchArray | null = name.match(packageRegex);
    // tslint:disable-next-line:triple-equals
    if (splits == undefined) {
        throw new Error('Could not parse package name');
    }
    // tslint:disable-next-line:triple-equals
    return (splits[1] != undefined) ? {
        basename: splits[2],
        scope: splits[1].slice(0, -1),
    } : {
        basename: splits[2],
    };
};
export const parseLernaPackages = async (cwd: string): Promise<IPackage[]> => {
    const pkgs: { name: string, location: string }[] = await getPackages(cwd);

    return pkgs
        .map((pkg: any): IPackage => {
            return {
                location: pkg.location,
                name: pkg.name,
                rootPath: pkg.rootPath,
                ...parsePackageName(pkg.name),
            };
        });
};