app.filter('tableSearch', function () {
    return function (list, query, fields) {

        if (!query) {
            return list;
        }
        query = query.toLowerCase().split(' ');
        if (!angular.isArray(fields)) {
            fields = [fields.toString()];
        }
        return list.filter(function (item) {
            return query.every(function (needle) {
                return fields.some(function (field) {
                    var content = item[field] != null ? item[field] : '';

                    if (!angular.isString(content)) {
                        content = '' + content;
                    }

                    return content.toLowerCase().indexOf(needle) > -1;
                });
            });
        });
    };
});