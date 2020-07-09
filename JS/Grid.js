export default class Grid {
    constructor(ID) {
        this.ID = `grid-${ID}`;
        this.rows = [];
        let panels = $(`#grid-${ID}`).children();

        //Store a reference of each visual panel to its corresponding row and cell
        for (let i = 0; i < 3; i++) {
            let row = [];

            for (let j = 0; j < 3; j++) {
                row.push(panels[3 * i + j]);
            }
            this.rows.push(row);
        }
    }
}