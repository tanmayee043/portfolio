// A small browser version of the three checks in Receipt IQ's validation.py.
const form = document.querySelector<HTMLFormElement>('#receipt');
const verdict = document.querySelector<HTMLElement>('#verdict');

if (form && verdict) {
  const quantities = [2, 1, 1];
  const inputs = [...form.querySelectorAll<HTMLInputElement>('[data-money]')];
  const original = new Map(inputs.map((input) => [input.name, input.value]));

  const read = (name: string) => {
    const input = form.elements.namedItem(name) as HTMLInputElement;
    const text = input.value.trim();
    return text === '' ? NaN : Number(text);
  };

  // Same allowed difference as the real validator's default.
  const differs = (a: number, b: number) => Math.abs(a - b) > 0.01;

  const check = () => {
    const issues: string[] = [];

    quantities.forEach((qty, i) => {
      const price = read(`price-${i}`);
      const total = read(`total-${i}`);
      if (differs(qty * price, total)) {
        issues.push(`items[${i}]: ${qty} × ${price} should be ${qty * price}, the receipt says ${total}.`);
      }
    });

    const items = quantities.reduce((sum, _, i) => sum + read(`total-${i}`), 0);
    const subtotal = read('subtotal');
    if (differs(items, subtotal)) {
      issues.push(`subtotal: the items add up to ${items}, the receipt says ${subtotal}.`);
    }

    const expected = subtotal + read('tax');
    const total = read('total');
    if (differs(expected, total)) {
      issues.push(`total: subtotal plus tax is ${expected}, the receipt says ${total}.`);
    }

    return issues;
  };

  const render = () => {
    const unreadable = inputs.some((input) => !Number.isFinite(Number(input.value)) || input.value.trim() === '');
    const changed = inputs.some((input) => input.value !== original.get(input.name));
    verdict.replaceChildren();

    const add = (title: string, text: string, state: string) => {
      const strong = document.createElement('strong');
      strong.textContent = title;
      verdict.append(strong, ` ${text}`);
      verdict.dataset.state = state;
    };

    if (unreadable) {
      add('Flagged.', 'Every amount has to be a number.', 'flagged');
      return;
    }

    const issues = check();
    if (issues.length > 0) {
      add('Flagged for review.', issues[0], 'flagged');
    } else if (changed) {
      add('Passed, and wrong.', "The numbers agree, so arithmetic can't tell. Azure once fooled it by reading 8.000 as 8.", 'fooled');
    } else {
      add('Passed.', 'Everything adds up.', 'passed');
    }
  };

  form.addEventListener('input', render);
  form.addEventListener('submit', (event) => event.preventDefault());

  document.querySelector('#bug')?.addEventListener('click', () => {
    for (const input of inputs) {
      input.value = String(Number(original.get(input.name)) / 1000);
    }
    render();
  });

  document.querySelector('#reset')?.addEventListener('click', () => {
    for (const input of inputs) {
      input.value = original.get(input.name) ?? '';
    }
    render();
  });
}
