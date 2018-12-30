class Connect4 {
    constructor(selector) {
        this.Rows = 6;
        this.Columns = 7;
        this.player = 'red';
        this.selector = $(selector);

        this.createGrid();
        this.setUpEventListeners();
    }


    createGrid() {
        const $borad = $(this.selector);
        for (let row = 1; row <= this.Rows; row++) {
            const $row = $('<div>').addClass('row');

            for (let col = 1; col <= this.Columns; col++) {
                const $col = $('<div>')
                    .addClass('col empty')
                    .attr('data-col', col)
                    .attr('data-row', row)
                $row.append($col);
            }

            $borad.append($row);
        }

    }

    setUpEventListeners() {
        const $borad = $(this.selector);
        let that = this;

        function findEmptyCell(colIndex) {
            const colCells = $(`.col[data-col='${colIndex}']`);
            for (let i = colCells.length; i >= 0; i--) {
                const $cell = $(colCells[i]);
                if ($cell.hasClass('empty')) return $cell;
            }
            return null;
        }

        $borad.on('mouseover', '.col', function () {
            const colIndex = $(this).data('col');
            const $lastEmptyCell = findEmptyCell(colIndex);
            if ($lastEmptyCell) $lastEmptyCell.addClass(`next-${that.player}`)
        })

        $borad.on('mouseleave', '.col', function () {
            $('.col').removeClass(`next-${that.player}`);
        })


        $borad.on('click', '.col', function () {
            const colIndex = $(this).data('col');
            const $lastEmptyCell = findEmptyCell(colIndex);

            if(!$lastEmptyCell)return;

            $lastEmptyCell.removeClass(`empty next-${that.player}`);
            $lastEmptyCell.addClass(that.player);
            const rowIndex = $lastEmptyCell.data('row');
            

            const winner = that.checkForWinner(rowIndex, colIndex, that.player);
            console.log(`player: ${that.player} /n winner: ${winner}`)
            if (winner) {
                alert(`Game Over! Playe ${that.player} has won`);
                return;
            }

            that.player = (that.player == 'red') ? 'black' : 'red';
            $(this).trigger('mouseenter');
        })
    }


    checkForWinner(rowIndex, colIndex, player) {
        let that = this;

        //check for 4 in a row: horizontally, vertically, diagonally


        function checkVerticalWin(colIndex, player) {
            //up and down direction

            //get all the player cells on the same column
            let verticalArr = [];
            let total = 1;

            for (let i = 1; i <= that.Rows; i++) {
                const cell = $(`.col[data-col="${colIndex}"][data-row="${i}"]`)
                if (cell.hasClass(`${player}`)) verticalArr.push(i);
            }

            //check for Consecutive numbers only
            verticalArr = verticalArr.sort();

            for (let i = 0; i < verticalArr.length - 1; i++) {
                let diff = verticalArr[i + 1] - verticalArr[i];
                if (diff == 1) total++;
                else total = 1;
            }

            return total;


        }

        function checkHorizontalWin(rowIndex, player) {
            //right and left directions
            //get all the player cells on the same row
            let horizontalArr = [];
            let total = 1;

            for (let i = 1; i <= that.Columns; i++) {
                const cell = $(`.col[data-col="${i}"][data-row="${rowIndex}"]`)
                if (cell.hasClass(`${player}`)) horizontalArr.push(i);
            }

            //check for Consecutive numbers only
            horizontalArr = horizontalArr.sort();

            for (let i = 0; i < horizontalArr.length - 1; i++) {
                let diff = horizontalArr[i + 1] - horizontalArr[i];
                if (diff == 1) total++;
                else total = 1
            }

            return total;
        }

        function checkDiagonallWin(rowIndex, colIndex, player) {

            function getDiagonals(rowIndex, colIndex) {
                let diagonalLeft = [], diagonalRight = [];

                for (let i = 1; i <= that.Rows; i++) {
                    for (let j = 1; j <= that.Columns; j++) {

                        //top left to bottom right
                        if (i - j == rowIndex - colIndex) {
                            diagonalLeft.push({ col: j, row: i })
                        }
                        //top right to bottom left
                        if (i + j == rowIndex + colIndex) {
                            diagonalRight.push({ col: j, row: i })
                        }
                    }
                }

                return [diagonalLeft, diagonalRight];

            }

            let diagonalLeft, diagonalRight, diagonals;

            diagonals = getDiagonals(rowIndex, colIndex);
            diagonalLeft = diagonals[0];
            diagonalRight = diagonals[1];

            let diagonalLeftBoolArr = diagonalLeft.map(
                (item) => {
                    const cell = $(`.col[data-col="${item.col}"][data-row="${item.row}"]`);
                    return (cell.hasClass(`${player}`))
                }
            )


            let diagonalRightBoolArr = diagonalRight.map(
                (item) => {
                    const cell = $(`.col[data-col="${item.col}"][data-row="${item.row}"]`);
                    return (cell.hasClass(`${player}`))
                }
            )

            let diagonalLeftTotal = 0;

            for (let i = 0; i < diagonalLeftBoolArr.length; i++) {

                if(diagonalLeftTotal == 4){
                    break;
                }
                if (diagonalLeftBoolArr[i]) { 
                    diagonalLeftTotal++; 
                }else{
                    diagonalLeftTotal = 0;
                }
            }

            // diagonalLeftBoolArr.forEach((item) => { item ? diagonalLeftTotal++ : diagonalLeftTotal = 0 });

            let diagonalRightTotal = 0;
            // diagonalRightBoolArr.forEach((item) => { item ? diagonalRightTotal++ : diagonalRightTotal = 0 });

            for (let i = 0; i < diagonalRightBoolArr.length; i++) {

                if(diagonalRightTotal == 4){
                    break;
                }
                if (diagonalRightBoolArr[i]) { 
                    diagonalRightTotal++; 
                }else{
                    diagonalRightTotal = 0;
                }
            }

            return diagonalLeftTotal == 4 || diagonalRightTotal == 4;
        }

        const verticalWin = checkVerticalWin(colIndex, player);
        const horizontalWin = checkHorizontalWin(rowIndex, player);
        const diagonalWin = checkDiagonallWin(rowIndex, colIndex, player);

        if (verticalWin == 4) return true;
        if (horizontalWin == 4) return true;
        if (diagonalWin) return true;

        return false;
    }


}