let seedData = [
    {"last_name": "Harris", "first_name": "Mike", "email_address": "mharris@updox.com", "specialty": "Pediatrics", "practice_name": "Harris Pediatrics"},
    {"last_name": "Wijoyo", "first_name": "Bimo", "email_address": "bwijoyo@updox.com", "specialty": "Podiatry", "practice_name": "Wijoyo Podiatry"},
    {"last_name": "Rose", "first_name": "Nate", "email_address": "nrose@updox.com", "specialty": "Surgery", "practice_name": "Rose Cutters"},
    {"last_name": "Carlson", "first_name": "Mike", "email_address": "mcarlson@updox.com", "specialty": "Orthopedics", "practice_name": "Carlson Orthopedics"},
    {"last_name": "Witting", "first_name": "Mike", "email_address": "mwitting@updox.com", "specialty": "Pediatrics", "practice_name": "Witting’s Well Kids Pediatrics"},
    {"last_name": "Juday", "first_name": "Tobin", "email_address": "tjuday@updox.com", "specialty": "General Medicine", "practice_name": "Juday Family Practice"}
    ];

$(document).ready(function () {
    ko.applyBindings(new directoryViewModel());
});

function directoryViewModel() {
    this.inputFields = [
        { name: 'Last Name', value: ko.observable().extend({ required: true }) },
        { name: 'First Name', value: ko.observable().extend({ required: true }) },
        { name: 'Email', value: ko.observable().extend({ required: true, email: true }) },
        { name: 'Speciality', value: ko.observable().extend({ required: false }) },
        { name: 'Practice Name', value: ko.observable().extend({ required: false}) },
    ];

    this.submitClick = () => {
        debugger;
    }
}