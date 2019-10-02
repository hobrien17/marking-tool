# Marking Tool
This tool was designed for COMP3506 marking.

## Setup

1. Run `npm install`
2. Place all student files in the `students` folder
3. Place `criteria.json` in the top-level folder

## Usage

1. Open a new terminal and run `npm start`
2. Navigate to `localhost:3000` in your browser
3. When finished, terminate the npm process (`^C`)

## Interface

### Menu Bar
The main menu bar sits at the top of the screen and displays the student being marked,
their total mark, and whether they have previously been marked.
This menu also contains the following buttons:

- **Prev** - Move to the previous assignment
- **Open files** - Show the student's files in your file explorer
- **Save** - Save the current marks (this button will be coloured blue when changes need to be saved)
- **Next** - Move to the next assignment

### Marking Criteria
The marking criteria area is situated on the left side of the screen.
For each criteria item, select one of the three options (good, satisfactory, or poor).
Comments will be autofilled based on the selected criteria, however you can
edit them as desired.

### Student Files
Any Java or PDF files will be displayed to the right of the screen.
Navigate between files using the tabbed menu. Other file formats, including directories,
are not supported. If no files appear, you will have to manually view the files.

## Notes
- When the save button is pressed, marks are saved to the `marks.txt` file in the student folder
- Existing `marks.txt` files are not loaded - if you revisit an already marked student
the tool will label it as 'marked' but give you an empty criteria sheet
- When manual changes to the marks file are made, ensure you do not save the tool's marks
or your changes will be overridden