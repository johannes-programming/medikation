async function loadConfigAndBuildUI() {
  const response = await fetch('cfg.json');
  const cfg = await response.json();
  const container = document.getElementById('container');

  for (const [drug, units] of Object.entries(cfg.conv)) {
    createMedicationBlock(drug, units, cfg, container);
  }
}

function createMedicationBlock(drug, units, cfg, container) {
  const block = document.createElement('div');
  block.className = 'medication-block';
  block.innerHTML = `<h2>${drug}</h2>`;

  const inputs = createUnitInputs(drug, units, block);
  attachInputListeners(drug, inputs, cfg);

  container.appendChild(block);
}

function createUnitInputs(drug, units, block) {
  const inputs = {};

  for (const unit of Object.keys(units)) {
    inputs[unit] = createLabeledInput(drug, unit, block);
  }

  return inputs;
}

function createLabeledInput(drug, unit, block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'unit-input';

  const label = document.createElement('label');
  label.textContent = unit + ':';
  label.setAttribute('for', `${drug}-${unit}`);

  const input = document.createElement('input');
  input.type = 'number';
  input.id = `${drug}-${unit}`;

  wrapper.appendChild(label);
  wrapper.appendChild(input);
  block.appendChild(wrapper);

  return input;
}

function attachInputListeners(drug, inputs, cfg) {
  for (const [unitName, inputEl] of Object.entries(inputs)) {
    setupConversionHandler(drug, unitName, inputEl, inputs, cfg);
  }
}

function setupConversionHandler(drug, unitName, inputEl, inputs, cfg) {
  inputEl.addEventListener('input', () => {
    const val = parseFloat(inputEl.value);
    if (isNaN(val)) return;

    const fromRatio = cfg.conv[drug][unitName];

    for (const [targetUnit, targetEl] of Object.entries(inputs)) {
      if (targetUnit === unitName) continue;
      const toRatio = cfg.conv[drug][targetUnit];
      const converted = (val / fromRatio) * toRatio;
      targetEl.value = converted.toFixed(4);
    }
  });
}

loadConfigAndBuildUI().catch(console.error);
