document.getElementById('csvFile').addEventListener('change', handleFileSelect, false);
document.getElementById('lookupButton').addEventListener('click', handleLookup, false);

let csvData = [];

function handleFileSelect(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        csvData = parseCSV(text);
        console.log('CSV Data:', csvData); // Debug log
        populateDropdown(csvData[0]);
    };
    reader.readAsText(file);
}

function parseCSV(text) {
    const lines = text.split('\n');
    return lines.map(line => line.split(','));
}

function populateDropdown(headers) {
    const dropdown = document.getElementById('returnColumn');
    dropdown.innerHTML = '';
    headers.forEach((header, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = header;
        dropdown.appendChild(option);
    });
    console.log('Dropdown populated with headers:', headers); // Debug log
}

function handleLookup() {
    const lookupValues = document.getElementById('lookupValues').value.split('\n').map(val => val.trim());
    const selectedOptions = Array.from(document.getElementById('returnColumn').selectedOptions);
    const returnColumnIndices = selectedOptions.map(option => option.value);
    console.log('Lookup Values:', lookupValues); // Debug log
    console.log('Selected Columns:', returnColumnIndices); // Debug log

    const results = csvData.filter(row => {
        const match = lookupValues.some(value => row.includes(value));
        console.log(`Checking row: ${row}, match: ${match}`); // Debug log
        return match;
    }).map(row => {
        const selectedData = returnColumnIndices.map(index => row[index]).join(',');
        console.log(`Selected data for row: ${row}, selectedData: ${selectedData}`); // Debug log
        return selectedData;
    });

    if (results.length > 0) {
        results.unshift(returnColumnIndices.map(index => csvData[0][index]).join(',')); // Add headers
    }
    console.log('Results:', results); // Debug log
    downloadCSV(results);
}

function downloadCSV(data) {
    const csvContent = "data:text/csv;charset=utf-8," + data.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.getElementById('downloadLink');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'results.csv');
    link.style.display = 'block';
    link.click();
}