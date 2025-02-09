// type QuickPickReturn<S extends SelectionKind> = S extends SelectionKind.Multiple
//   ? string[]
//   : string;

// type QuickPickReturn<S extends SelectionKind> = S extends SelectionKind.Multiple
//   ? string[]
//   : S extends SelectionKind.Single
//   ? string
//   : never;

interface QuickPickReturn {
  [SelectionKind.Single]: string;
  [SelectionKind.Multiple]: string[];
}

/**
 * @param prompt The text to show to a user.
 * @param selectionKind Whether a user can select multiple options, or just a single option.
 * @param items Each of the options presented to the user.
 **/
async function showQuickPick<S extends SelectionKind>(
  prompt: string,
  selectionKind: S,
  items: readonly string[]
): Promise<QuickPickReturn[S]> {
  if (items.length < 1) {
    throw new Error("At least one item must be provided.");
  }

  // Create buttons for every option.
  const buttons = items.map((item) => ({
    selected: false,
    text: item,
  }));

  // Default to the first element if necessary.
  if (selectionKind === SelectionKind.Single) {
    buttons[0].selected = true;
  }

  // Event handling code goes here...

  // Figure out the selected items
  const selectedItems = buttons
    .filter((button) => button.selected)
    .map((button) => button.text);

  if (selectionKind === SelectionKind.Single) {
    // Pick the first (only) selected item.
    return selectedItems[0];
  } else {
    // Return all selected items.
    return selectedItems;
  }
}

enum SelectionKind {
  Single,
  Multiple,
}

// `SelectionKind.Multiple` gives a `string[]` - works ✅
const shoppingList: string[] = await showQuickPick(
  "Which fruits do you want to purchase?",
  SelectionKind.Multiple,
  ["apples", "oranges", "bananas", "durian"]
);

// `SelectionKind.Single` gives a `string` - works ✅
const dinner: string = await showQuickPick(
  "What's for dinner tonight?",
  SelectionKind.Single,
  ["sushi", "pasta", "tacos", "ugh I'm too hungry to think, whatever you want"]
);

console.log(
  `Alright, going out to buy some ${shoppingList.join(", ")}`,
  dinner
);
