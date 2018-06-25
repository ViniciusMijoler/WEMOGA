app.service('alertas', function(){
    return {
        alertSucess: function(string) {
            $.bootstrapGrowl(string, {
                type: 'success',
                align: 'center',
                width: 260,
            });
        },
        alertWarning: function(string) {
            $.bootstrapGrowl(string, {
                type: 'warning',
                align: 'center',
                width: 260,
            });
        },
        alertDanger: function(string) {
            $.bootstrapGrowl(string, {
                type: 'danger',
                align: 'center',
                width: 260,
            });
        }
    }
});