// عناصر DOM
const countrySelect = document.getElementById("country");
const governorateSelect = document.getElementById("governorate");
const branchesTableBody = document.getElementById("branchesTableBody");

// بيانات الفروع (سيتم تحميلها من ملف JSON)
let branchesData = {};

// تحميل بيانات الفروع من ملف JSON
async function loadBranchesData() {
  try {
    const response = await fetch("../json/branches.json"); // تأكد من المسار الصحيح لملف JSON
    branchesData = await response.json();
    populateCountries();
  } catch (error) {
    console.error("حدث خطأ أثناء تحميل البيانات:", error);
  }
}

// تعبئة قائمة الدول
function populateCountries() {
  countrySelect.innerHTML = '<option value="">-- اختر الدولة --</option>';
  const option = document.createElement("option");
  option.value = branchesData.country;
  option.textContent = branchesData.country;
  countrySelect.appendChild(option);
}

// تعبئة قائمة المحافظات بناءً على الدولة المختارة
function populateGovernorates() {
  governorateSelect.innerHTML = '<option value="">-- اختر المحافظة --</option>';
  branchesData.governorates.forEach((governorate) => {
    const option = document.createElement("option");
    option.value = governorate.name;
    option.textContent = governorate.name;
    governorateSelect.appendChild(option);
  });
  governorateSelect.disabled = false;
}

// عرض الفروع في الجدول
function displayBranches(selectedGovernorate) {
  branchesTableBody.innerHTML = "";
  const governorate = branchesData.governorates.find(
    (gov) => gov.name === selectedGovernorate
  );
  if (governorate) {
    governorate.branches.forEach((branch) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${branch.name}</td>
        <td>${branch.address}</td>
        <td>${branch.phone}</td>
        <td>${
          branch.location
            ? `(${branch.location.latitude}, ${branch.location.longitude})`
            : "غير متوفر"
        }</td>
      `;
      branchesTableBody.appendChild(row);
    });
  }
}

// إضافة Event Listeners
countrySelect.addEventListener("change", () => {
  if (countrySelect.value) {
    populateGovernorates();
  } else {
    governorateSelect.innerHTML =
      '<option value="">-- اختر المحافظة --</option>';
    governorateSelect.disabled = true;
    branchesTableBody.innerHTML = "";
  }
});

governorateSelect.addEventListener("change", () => {
  const selectedGovernorate = governorateSelect.value;
  if (selectedGovernorate) {
    displayBranches(selectedGovernorate);
  } else {
    branchesTableBody.innerHTML = "";
  }
});

// تهيئة الصفحة
loadBranchesData();
