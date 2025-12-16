// This is a module which provides a method to find the smallest number of knights moves between
// two points on a chessboard, returning one path of this length.
// A graph is constructed breadth-first from the start point until the end point is reached,
// with each node containing the position it represents and a reference to the node the knight
// moved there from.
// Once found, we traverse from the end node back through the graph, storing the positions
// of each step along the way.

const knightsTravailsSolver = (() => {

    // 8*8 board, index 0-7
    const _maxBoardIndex = 7;

    // The 8 possible knight moves in standard chess
    const knightMoves = [[2,1], [2,-1], [-2,1], [-2,-1], [1,2], [1,-2], [-1,2], [-1,-2]];

    // List of visited positions on the board, used to avoid repeating tiles through multiple routes
    let positions;

    // tracks the path the knight must take to reach its destination in the shortest time
    let moves;

    // Globally accessible method to determine a smallest number of moves (other routes of 
    // equal length may exist) from start to end using knights moves
    function findPath(start, end) {

        // If start or end are out of bounds, return null - no valid path
        if (start[0] < 0 || start[0] > _maxBoardIndex || start[1] < 0 || start[1] > _maxBoardIndex || end[0] < 0 || end[0] > _maxBoardIndex || end[1] < 0 || end[1] > _maxBoardIndex) { return null; }

        // If start and end are the same, return start - no moves.
        if (start[0] == end[0] && start[1] == end[1]) { return [start]; }

        // Initialise positions as a map for O(1) existence checking
        positions = new Map();

        moves = [];

        // create start node
        let startNode = Node(start);
        positions.set(start[0]+(_maxBoardIndex+1)*start[1], 1);

        // Find all positions reachable from startNode, until the end position is reached
        _findNextSteps([startNode], end);

        // Return the path from end -> start reversed, so start -> end
        return moves.reverse();

    }

    // Breadth first search until the end position is reached
    function _findNextSteps(nodes, end) {

        // If end position can't be found, throw an error
        if (nodes.length == 0) { throw Error("End position could not be found"); }

        // The nodes to be searched from on the next 
        let nextNodes = [];

        // search from every node at the current depth
        for (let i in nodes) {

            let node = nodes[i];

            // Get the position of the current node being searched from
            let position = node.position;

            // Loop over the possible knight moves
            for (let j in knightMoves) {

                let move = knightMoves[j];

                // Get the position of the knight after moving
                let pos = [position[0] + move[0], position[1] + move[1]];

                // If the new position is already visited or off the chess board, try a new move
                if (positions.get(pos[0]+(_maxBoardIndex+1)*pos[1])) { continue; }
                if (pos[0] < 0 || pos[0] > _maxBoardIndex || pos[1] < 0 || pos[1] > _maxBoardIndex) { continue; }

                // Otherwise, create a node with the new position and a reference to where it came from
                let newNode = Node(pos, node);

                // If the new position is the destination, traceback the path to the start, and stop searching
                if (pos[0] == end[0] && pos[1] == end[1]) {
                    _traceBack(newNode);
                    return;
                }

                // Otherwise, add the new node to the list of nodes to be checked (at higher depth in the search)
                // and add its position to the set of those visited.
                nextNodes.push(newNode);
                positions.set(pos[0]+(_maxBoardIndex+1)*pos[1], true);

            }
        }

        // If still not found, continue search at the next depth into the graph,
        // by checking the paths from the unique positions reached at this depth
        _findNextSteps(nextNodes, end);

    }

    // Recursively constructs the path of knight's moves, by backtracking from the endpoint to the start
    function _traceBack(node) {
        moves.push(node.position);
        if (node.source) { _traceBack(node.source); }
    }

    return { findPath }

})()

// Node objects for constructing the search space. Nodes contain their position and a reference
// to the node containing the position the knight travelled to its own position from.
// This allows rapid traversal back along the path to the start once the end is reached.
function Node(position, source = null) { return {
    position: position,
    source: source,
}}

export default knightsTravailsSolver;