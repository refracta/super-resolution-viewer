export default {
    features: {
        file: (target, file, viewer) => `/${target.path}/${file}`,
        targetBefore: (target, index, array, viewer) => target,
        targetAfter: (target, index, array, viewer) => target
    }, results: {
        file: (target, file, viewer) => {
            const dotIndex = file.lastIndexOf('.');
            const fileName = file.substring(0, dotIndex);
            const fileExt = file.substring(dotIndex + 1, file.length);
            file = target.suffix ? `${fileName}_${target.suffix}.${fileExt}` : file;
            return `/${target.path}/${file}`;
        }, targetBefore: (target, index, array, viewer) => {
            if (target.groundtruth) {
                for (let {search, replacement} of [{search: 'Manga109', replacement: 'manga109'}, {
                    search: 'Urban100', replacement: 'urban100'
                }, {search: 'datasets/DIV2K100/GTmod12', replacement: 'datasets/DIV2K/DIV2K_valid_HR'}]) {
                    target.path = target.path.replace(search, replacement);
                }
            }
            return target;
        }, targetAfter: (target, index, array, viewer) => {
            if (!target.groundtruth) {
                const gtTarget = viewer.baseTarget;
                const gtFile = gtTarget.files[0];
                const dotIndex = gtFile.lastIndexOf('.');
                const gtName = gtFile.substring(0, dotIndex);
                const gtExt = gtFile.substring(dotIndex + 1, gtFile.length);
                const matchFile = target.files.find(f => f.startsWith(gtName + '_') && f.endsWith('.' + gtExt));
                // TODO matchFile GT
                // Zoom parameter
                target.suffix = matchFile.substring(gtName.length + 1, matchFile.length - (gtExt.length + 1))
            }
            return target;
        }
    }
}
