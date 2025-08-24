(function () {
    let logs = [];

    // Override console.log to capture logs
    const originalLog = console.log;
    console.log = function (...args) {
        logs.push(`[${new Date().toISOString()}] ${args.map(arg => JSON.stringify(arg)).join(" ")}`);
        originalLog.apply(console, args);
    };

    function downloadStimuliAsCSV(pre_stimuli, norm_learn, comp_learn, cat_stimuli, int_stimuli) {
        try {
            const flattenStimulusArray = (data) => {// If array of arrays, flatten to array of objects
                if (Array.isArray(data[0])) {
                    return data.flat(); // Or use .reduce((a,b) => a.concat(b), []) if .flat() is unsupported
                  }
                  return data;
                };
            const stimulusSets = [
              { label: "Preslider baseline stimuli", data: flattenStimulusArray(pre_stimuli) },
              { label: "Norminal learn", data: flattenStimulusArray(norm_learn) },
              { label: "Ordinal learn", data: flattenStimulusArray(comp_learn) },
              { label: "Predicate test", data: flattenStimulusArray(cat_stimuli) },
              { label: "Modifier test", data: flattenStimulusArray(int_stimuli) }
            ];

            // Flatten all stimulus objects into one array with type labels
            const allStimuli = [];

            for (const set of stimulusSets) {
                for (const stim of set.data) {
                    const entry = { StimulusType: set.label, ...stim };
                    allStimuli.push(entry);
                }
            }

            // Get all unique keys across all stimuli (for CSV header)
            const allKeys = Array.from(new Set(allStimuli.flatMap(obj => Object.keys(obj))));

            // Build CSV
            const csvHeader = allKeys.join(",") + "\n";
            const csvRows = allStimuli.map(stim => {
                return allKeys.map(key => {
                    const val = stim[key];
                    return `"${(val !== undefined ? String(val).replace(/"/g, '""') : "")}"`;
                }).join(",");
            });

            const csvContent = csvHeader + csvRows.join("\n");

            // Download
            const timestamp = new Date().toISOString().replace(/[:.]/g, "_");
            const filename = `stimuli_data_${timestamp}.csv`;
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("downloadStimuliAsCSV failed:", err);
        }
    }

    window.downloadConsoleLogs = downloadStimuliAsCSV;
})();
