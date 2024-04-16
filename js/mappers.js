export default {
    "default": {
        file: (target, file, viewer) => `/${target.path}/${file}`,
        targetBefore: (target, index, array, viewer) => target,
        targetAfter: (target, index, array, viewer) => target
    }, "basicsr-features": {
        file: (target, file, viewer) => `/${target.path}/${file}`,
        targetBefore: (target, index, array, viewer) => target,
        targetAfter: (target, index, array, viewer) => target
    }, "basicsr-results": {
        file: (target, file, viewer) => {
            const dotIndex = file.lastIndexOf('.');
            const fileName = file.substring(0, dotIndex);
            const fileExt = file.substring(dotIndex + 1, file.length);
            file = target.suffix ? `${fileName}${target.suffix}.${fileExt}` : file;
            return `/${target.path}/${file}`;
        }, targetBefore: (target, index, array, viewer) => {
            if (target.groundTruth) {
                for (let { search, replacement } of [{ search: 'Manga109', replacement: 'manga109' }, {
                    search: 'Urban100', replacement: 'urban100'
                }, { search: 'datasets/DIV2K100/GTmod12', replacement: 'datasets/DIV2K/DIV2K_valid_HR' }]) {
                    target.path = target.path.replace(search, replacement);
                }
            }
            return target;
        }, targetAfter: (target, index, array, viewer) => {
            if (!target.groundTruth) {
                const gtTarget = viewer.baseTarget;
                const gtFile = gtTarget.files[0];
                const dotIndex = gtFile.lastIndexOf('.');
                const gtName1 = gtFile.substring(0, dotIndex);
                const gtExt = gtFile.substring(dotIndex + 1, gtFile.length);
                let matchFile = target.files.find(f => f.startsWith(gtName1) && f.endsWith('.' + gtExt));
                const splitMatchFile = matchFile.substring(gtName1.length);
                const gtName2 = gtName1 + splitMatchFile.split('_').shift();
                if (gtName1 === gtName2) {
                    target.suffix = '_' + matchFile.substring(gtName2.length + 1, matchFile.length - (gtExt.length + 1));
                } else {
                    target.suffix = gtName2.substring(gtName1.length) + '_' + matchFile.substring(gtName2.length + 1, matchFile.length - (gtExt.length + 1));
                }
            }
            return target;
        }
    }
}
