var table;

$(document).ready(function () {
    //Start view model
    ko.applyBindings(new directoryViewModel());

    //Initialize data table
    table = $('#provider-table').DataTable({
        "bPaginate": false,
        "sScrollY": 200,
        "order": [],
        "language": {
            "emptyTable": ""
        }
    });

    //Add on click listener for selected rows
    $('#provider-table tbody').on('click', 'tr', function () {
        selectItem(this);
        $(this).toggleClass('selected-row');
    });

    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-bottom-center",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
});

selectedItems = [];

selectItem = (data) => {
    let retData;
    if ($(data).length > 0) {
        retData = $(data)[0].innerText.split('\n')
    }

    //Serialize the array into an object
    let retObject = {};
    retObject.last_name = retData[0].split(', ')[0];
    retObject.first_name = retData[0].split(', ')[1];
    retObject.email_address = retData[1].trim();
    retObject.specialty = retData[2];
    retObject.practice_name = retData[3];

    //If it has the selected-row class, push it into selectedItems. else, remove it from selectedItems
    if (!$(data).hasClass('selected-row'))
        selectedItems.push(retObject);
    else {
        $.each(selectedItems, (index, item) => {
            if (item.email_address == retObject.email_address) {
                selectedItems.splice(index, 1);
            }
        })
    }
}

//Script for clearable fields
function tog(v) { return v ? 'addClass' : 'removeClass'; }
$(document).on('input', '.clearable', function () {
    $(this)[tog(this.value)]('x');
}).on('mousemove', '.x', function (e) {
    $(this)[tog(this.offsetWidth - 18 < e.clientX - this.getBoundingClientRect().left)]('onX');
}).on('touchstart click', '.onX', function (ev) {
    ev.preventDefault();
    $(this).removeClass('x onX').val('').change();
});

ko.validation.init({
    grouping: {
        deep: true,
        live: true,
        observable: true
    }
});

function directoryViewModel() {
    this.seedData = ko.observableArray([
    { "last_name": "Harris", "first_name": "Mike", "email_address": "mharris@updox.com", "specialty": "Pediatrics", "practice_name": "Harris Pediatrics" },
    { "last_name": "Wijoyo", "first_name": "Bimo", "email_address": "bwijoyo@updox.com", "specialty": "Podiatry", "practice_name": "Wijoyo Podiatry" },
    { "last_name": "Rose", "first_name": "Nate", "email_address": "nrose@updox.com", "specialty": "Surgery", "practice_name": "Rose Cutters" },
    { "last_name": "Carlson", "first_name": "Mike", "email_address": "mcarlson@updox.com", "specialty": "Orthopedics", "practice_name": "Carlson Orthopedics" },
    { "last_name": "Witting", "first_name": "Mike", "email_address": "mwitting@updox.com", "specialty": "Pediatrics", "practice_name": "Witting's Well Kids Pediatrics" },
    { "last_name": "Juday", "first_name": "Tobin", "email_address": "tjuday@updox.com", "specialty": "General Medicine", "practice_name": "Juday Family Practice" }
    ]);

    this.testData = [
        { "last_name": "Carlson", "first_name": "Mike", "email_address": "mcarlson@updox.com", "specialty": "Orthopedics", "practice_name": "Carlson Orthopedics" },
        { "last_name": "Witting", "first_name": "Mike", "email_address": "mwitting@updox.com", "specialty": "Pediatrics", "practice_name": "Witting's Well Kids Pediatrics" }
    ];

    this.inputFields = [
        { name: 'Last Name', value: ko.observable().extend({ required: true }) },
        { name: 'First Name', value: ko.observable().extend({ required: true }) },
        { name: 'Email', value: ko.observable().extend({ required: true, email: true }) },
        { name: 'Specialty', value: ko.observable().extend({ required: false }) },
        { name: 'Practice Name', value: ko.observable().extend({ required: false }) },
    ];

    this.errors = ko.validation.group(this.inputFields);

    ko.validation.rules.pattern.message = 'Invalid.';

    this.submitClick = () => {

        //If there are errors, show all errors and pop a toast. else, continue with the submit.
        if (this.errors().length > 0) {
            this.errors.showAllMessages();
            toastr["error"]("Invalid fields detected");
        }
        else {
            let pushItem = this.buildItem();

            let providerInfo = "<h4 class=\"name-style\">" + pushItem.last_name + ', ' + pushItem.first_name + "</h4>\
                <span class=\"provider-email\">" + pushItem.email_address + "</span>";

            let providerSpec = "<div class=\"provider-details\">\
                                    <h5>" + pushItem.specialty + "</h5>\
                                    <span>" + pushItem.practice_name + "</span>\
                                </div>";

            //Add the newly formed row into the data table
            table.row.add([providerInfo, providerSpec]).draw();

            //Reinitialize the data table
            table = $('#provider-table').DataTable({
                "bPaginate": false,
                "sScrollY": 200,
                "order": [],
                "language": {
                    "emptyTable": ""
                },
                "destroy": true
            });

            //Clear out the form on submit
            $.each(this.inputFields, (index, item) => {
                item.value('');
            });

            //Hide errors and pop a success toast
            this.errors.showAllMessages(false);
            toastr["success"]("Record added!");
        }
    }

    this.buildItem = () => {
        let retItem = {
            "last_name": this.inputFields[0].value(),
            "first_name": this.inputFields[1].value(),
            "email_address": this.inputFields[2].value(),
            "specialty": this.inputFields[3].value() != undefined ? this.inputFields[3].value() : '',
            "practice_name": this.inputFields[4].value() != undefined ? this.inputFields[4].value() : '',
        };

        this.seedData.push(retItem);

        return retItem;
    }

    this.removeClick = () => {
        this.removeRows();
    }

    this.removeRows = () => {
        //Remove the selected rows from the data table
        table.rows('.selected-row').remove().draw();
        $('tr:has(td.dataTables_empty)').css('display', 'none');

        //Remove the selected rows from the seedData
        $.each(selectedItems, (index, item) => {
            $.each(this.seedData(), (i, x) => {
                if (JSON.stringify(item) == JSON.stringify(x)) {
                    this.seedData.splice(index, 1);
                    return false;
                }
            });
        });
    }
}