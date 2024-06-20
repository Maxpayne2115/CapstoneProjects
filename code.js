let requirementIndex = 0;

function addRequirement() {
    requirementIndex++;
    const requirementsContainer = document.getElementById('requirementsContainer');

    const requirementTable = document.createElement('table');
    requirementTable.className = 'requirements';
    requirementTable.id = `requirementTable${requirementIndex}`;
    requirementTable.innerHTML = `
        <tr>
            <th>Requirement F${requirementIndex}</th>
            <td><input type="text" id="requirement-${requirementIndex}-input" maxlength="5000" required></td>
        </tr>
    `;

    requirementsContainer.appendChild(requirementTable);
}

function submitForm() {
    const projectId = document.getElementById('projectId').value;
    const projectName = document.getElementById('projectName').value;
    const clientName = document.getElementById('clientName').value;
    const applications = document.getElementById('applications').value;

    const submittedDataBody = document.getElementById('submittedDataBody');
    const rows = [];

    rows.push(`<tr><td>Project ID</td><td>${projectId}</td></tr>`);
    rows.push(`<tr><td>Project Name</td><td>${projectName}</td></tr>`);
    rows.push(`<tr><td>Client Name</td><td>${clientName}</td></tr>`);
    rows.push(`<tr><td>Applications</td><td>${applications}</td></tr>`);

    for (let i = 1; i <= requirementIndex; i++) {
        const requirementInput = document.getElementById(`requirement-${i}-input`).value;
        rows.push(`<tr><td>Requirement F${i}</td><td>${requirementInput}</td></tr>`);
    }

    submittedDataBody.innerHTML = rows.join('');

    document.getElementById('formSection').classList.add('hidden');
    document.getElementById('tableSection').classList.remove('hidden');
}

async function generateFiles(fileType) {
    const projectId = document.getElementById('projectId').value;
    const projectName = document.getElementById('projectName').value;
    const clientName = document.getElementById('clientName').value;
    const applications = document.getElementById('applications').value;
    const requirements = [];

    for (let i = 1; i <= requirementIndex; i++) {
        const requirementInput = document.getElementById(`requirement-${i}-input`).value;
        requirements.push(`F${i}: ${requirementInput}`);
    }

    const response = await fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            projectId, projectName, clientName, applications, requirements, fileType
        })
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project.${fileType === 'excel' ? 'xlsx' : 'docx'}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
}
