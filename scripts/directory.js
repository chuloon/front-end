var table;

$(document).ready(function () {
    ko.applyBindings(new directoryViewModel());

    table = $('#provider-table').DataTable({
        "bPaginate": false,
        "sScrollY": 200,
        "order": [],
        "language": {
            "emptyTable": ""
        }
    });

    $('#provider-table tr').click(function () {
        selectItem(this);
        $(this).toggleClass('selected-row');
    });
});

function selectedObject() {
    last_name = "",
    first_name = "",
    email_address = "",
    specialty = "",
    practice_name = ""
};

selectedItems = [];

selectItem = (data) => {
    let retData;
    if ($(data).length > 0) {
        retData = $(data)[0].innerText.split('\n')
    }

    let retObject = {};
    retObject.last_name = retData[0].split(', ')[0];
    retObject.first_name = retData[0].split(', ')[1];
    retObject.email_address = retData[1].trim();
    retObject.specialty = retData[2];
    retObject.practice_name = retData[3];

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

function tog(v) { return v ? 'addClass' : 'removeClass'; }
$(document).on('input', '.clearable', function () {
    $(this)[tog(this.value)]('x');
}).on('mousemove', '.x', function (e) {
    $(this)[tog(this.offsetWidth - 18 < e.clientX - this.getBoundingClientRect().left)]('onX');
}).on('touchstart click', '.onX', function (ev) {
    ev.preventDefault();
    $(this).removeClass('x onX').val('').change();
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

    this.submitClick = () => {
        debugger;
    }

    this.removeClick = () => {
        this.removeRows();
    }

    this.removeRows = () => {
        table.rows('.selected-row').remove().draw();
        $('tr:has(td.dataTables_empty)').css('display', 'none');

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