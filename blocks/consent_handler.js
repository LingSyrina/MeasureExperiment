// Function to get URL parameters
function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}

// Generate Subject ID and add properties
function setupSubjectID(jsPsych) {
    var SONAID = getUrlParameter('id');
    var subjectID = SONAID;
    if (subjectID === undefined) {
        subjectID = jsPsych.randomization.randomID(8);
    }
    jsPsych.data.addProperties({ subject_id: subjectID });
    return subjectID;
}

// Check Consent Function
function checkConsent(elem) {
    if (document.getElementById('consent_checkbox').checked) {
        return true;
    } else {
        alert("Please check the box next to the statement 'I agree to participate in this study.' if you wish to continue.");
        return false;
    }
}

// Create Consent Trial
function createConsentTrial() {
    return {
        type: jsPsychExternalHtml,
        // url: "https://lingsyrina.github.io/consent.html", // old URL
        url: "https://lingsyrina.github.io/MagnitudeExperiments/consent.html", //updated consent html 
        cont_btn: "start",
        check_fn: checkConsent
    };
}

// const expID = "iPtLEVGIdxPA";
// let condition;
// let group_name;

function saveServerData(expID, subjectID, group_name, condition) {
    return {
        type: jsPsychPipe,
        action: "save",
        experiment_id: expID,
        filename: () => `${group_name}_${subjectID}_${condition}.csv`,
        data_string: ()=>jsPsych.data.get().csv(),
        post_trial_gap: 1000
    };
}
