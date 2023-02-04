

const state = {
    company: "",
    started: false,
    game: {},
};

const speed = 22;
const wnd = eval("window");
const doc = wnd["document"];
const infiltrationGames = [
    {
        name: "type it backward",
        init: function (screen) {
            const lines = getLines(getEl(screen, "p"));
            state.game.data = lines[0].split("");
        },
        play: function (screen) {
            if (!state.game.data || !state.game.data.length) {
                delete state.game.data;
                return;
            }

            pressKey(state.game.data.shift());
        },
    },
    {
        name: "type it backward",
        init: function (screen) {
            const lines = getLines(getEl(screen, "p"));
            state.game.data = lines[0].split("");
        },
        play: function (screen) {
            if (!state.game.data || !state.game.data.length) {
                delete state.game.data;
                return;
            }

            pressKey(state.game.data.shift());
        },
    },
    {
        name: "type it",
        init: function (screen) {
            const lines = getLines(getEl(screen, "p"));
            state.game.data = lines[0].split("");
        },
        play: function (screen) {
            if (!state.game.data || !state.game.data.length) {
                delete state.game.data;
                return;
            }

            pressKey(state.game.data.shift());
        },
    },
    {
        name: "enter the code",
        init: function (screen) { },
        play: function (screen) {
            const h4 = getEl(screen, "h4");
            const code = h4[1].textContent;

            switch (code) {
                case "↑":
                    pressKey("w");
                    break;
                case "↓":
                    pressKey("s");
                    break;
                case "←":
                    pressKey("a");
                    break;
                case "→":
                    pressKey("d");
                    break;
            }
        },
    },
    {
        name: "close the brackets",
        init: function (screen) {
            const data = getLines(getEl(screen, "p"));
            const brackets = data.join("").split("");
            state.game.data = [];

            for (let i = brackets.length - 1; i >= 0; i--) {
                const char = brackets[i];

                if ("<" == char) {
                    state.game.data.push(">");
                } else if ("(" == char) {
                    state.game.data.push(")");
                } else if ("{" == char) {
                    state.game.data.push("}");
                } else if ("[" == char) {
                    state.game.data.push("]");
                }
            }
        },
        play: function (screen) {
            if (!state.game.data || !state.game.data.length) {
                delete state.game.data;
                return;
            }

            pressKey(state.game.data.shift());
        },
    },
    {
        name: "attack when his guard is down",
        init: function (screen) {
            state.game.data = "wait";
        },
        play: function (screen) {
            const data = getLines(getEl(screen, "h4"));

            if ("attack" === state.game.data) {
                pressKey(" ");
                state.game.data = "done";
            }

            // Attack in next frame - instant attack sometimes
            // ends in failure.
            if ('wait' === state.game.data && (data.indexOf("Preparing?") !== -1)) {
                state.game.data = "attack";
            }
        },
    },
    {
        name: "say something nice about the guard",
        init: function (screen) { },
        play: function (screen) {
            const correct = [
                "affectionate",
                "agreeable",
                "bright",
                "charming",
                "creative",
                "determined",
                "energetic",
                "friendly",
                "funny",
                "generous",
                "polite",
                "likable",
                "diplomatic",
                "helpful",
                "giving",
                "kind",
                "hardworking",
                "patient",
                "dynamic",
                "loyal",
                "based",
                "straightforward",
            ];
            const word = getLines(getEl(screen, "h5"))[1];

            if (-1 !== correct.indexOf(word)) {
                pressKey(" ");
            } else {
                pressKey("w");
            }
        },
    },
    {
        name: "remember all the mines",
        init: function (screen) {
            const rows = getEl(screen, "p");
            let gridSize = null;
            switch (rows.length) {
                case 9:
                    gridSize = [3, 3];
                    break;
                case 12:
                    gridSize = [3, 4];
                    break;
                case 16:
                    gridSize = [4, 4];
                    break;
                case 20:
                    gridSize = [4, 5];
                    break;
                case 25:
                    gridSize = [5, 5];
                    break;
                case 30:
                    gridSize = [5, 6];
                    break;
                case 36:
                    gridSize = [6, 6];
                    break;
            }
            if (gridSize == null) {
                return;
            }
            //12 20 30 42
            state.game.data = [];
            let index = 0;
            //for each row
            for (let y = 0; y < gridSize[1]; y++) {
                //initialize array data
                state.game.data[y] = [];
                for (let x = 0; x < gridSize[0]; x++) {
                    //for each column in the row add to state data if it has a child
                    if (rows[index].children.length > 0) {
                        state.game.data[y].push(true);
                    } else state.game.data[y].push(false);
                    index += 1;
                }
            }
        },
        play: function (screen) { },
    },
    {
        name: "mark all the mines",
        init: function (screen) {
            state.game.x = 0;
            state.game.y = 0;
            state.game.cols = state.game.data[0].length;
            state.game.dir = 1;
        },
        play: function (screen) {
            let { data, x, y, cols, dir } = state.game;

            if (data[y][x]) {
                pressKey(" ");
                data[y][x] = false;
            }

            x += dir;

            if (x < 0 || x >= cols) {
                x = Math.max(0, Math.min(cols - 1, x));
                y++;
                dir *= -1;
                pressKey("s");
            } else {
                pressKey(dir > 0 ? "d" : "a");
            }

            state.game.data = data;
            state.game.x = x;
            state.game.y = y;
            state.game.dir = dir;
        },
    },
    {
        name: "match the symbols",
        init: function (screen) {
            const data = getLines(getEl(screen, "h5 span"));
            const rows = getLines(getEl(screen, "p"));
            const keypad = [];
            const targets = [];
            let gridSize = null;
            switch (rows.length) {
                case 9:
                    gridSize = [3, 3];
                    break;
                case 12:
                    gridSize = [3, 4];
                    break;
                case 16:
                    gridSize = [4, 4];
                    break;
                case 20:
                    gridSize = [4, 5];
                    break;
                case 25:
                    gridSize = [5, 5];
                    break;
                case 30:
                    gridSize = [5, 6];
                    break;
                case 36:
                    gridSize = [6, 6];
                    break;
            }
            if (gridSize == null) {
                return;
            }
            //build the keypad grid.
            let index = 0;
            for (let i = 0; i < gridSize[1]; i++) {
                keypad[i] = [];
                for (let y = 0; y < gridSize[0]; y++) {

                    keypad[i].push(rows[index]);
                    index += 1;
                }
            }
            for (let i = 0; i < data.length; i++) {
                const symbol = data[i].trim();
                for (let j = 0; j < keypad.length; j++) {
                    const k = keypad[j].indexOf(symbol);

                    if (-1 !== k) {
                        targets.push([j, k]);
                        break;
                    }
                }
            }
            state.game.data = targets;
            state.game.x = 0;
            state.game.y = 0;
        },
        play: function (screen) {
            const target = state.game.data[0];
            let { x, y } = state.game;

            if (!target) {
                return;
            }

            const to_y = target[0];
            const to_x = target[1];

            if (to_y < y) {
                y--;
                pressKey("w");
            } else if (to_y > y) {
                y++;
                pressKey("s");
            } else if (to_x < x) {
                x--;
                pressKey("a");
            } else if (to_x > x) {
                x++;
                pressKey("d");
            } else {
                pressKey(" ");
                state.game.data.shift();
            }

            state.game.x = x;
            state.game.y = y;
        },
    },
    {
        name: "cut the wires with the following properties",
        init: function (screen) {
            let numberHack = ["1","2","3","4","5","6","7","8","9"];
            const colors = {
                red: "red",
                white: "white",
                blue: "blue",
                "rgb(255, 193, 7)": "yellow",
            };
            const wireColor = {
                red: [],
                white: [],
                blue: [],
                yellow: [],
            };
            var instructions = []
            for (let child of screen.children) instructions.push(child);
            var wiresData = instructions.pop();
            instructions.shift();
            instructions = getLines(instructions);
            const samples = getEl(wiresData, "p");
            const wires = [];
            let wireCount = 0;
            for (let i = wireCount; i < samples.length; i++) {
                if (numberHack.includes(samples[i].innerText)) wireCount += 1;
                else break;
            }
            let index = 0;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < wireCount; j++) {
                    const node = samples[index];
                    const color = colors[node.style.color];
                    if (!color) {
                        index += 1;
                        continue;
                    }
                    wireColor[color].push(j+1);
                    index += 1;
                }
            }

            for (let i = 0; i < instructions.length; i++) {
                const line = instructions[i].trim().toLowerCase();

                if (!line || line.length < 10) {
                    continue;
                }
                if (-1 !== line.indexOf("cut wires number")) {
                    const parts = line.split(/(number\s*|\.)/);
                    wires.push(parseInt(parts[2]));
                }
                if (-1 !== line.indexOf("cut all wires colored")) {
                    const parts = line.split(/(colored\s*|\.)/);
                    const color = parts[2];

                    if (!wireColor[color]) {
                        continue;
                    }

                    wireColor[color].forEach((num) => wires.push(num));
                }
            }

            state.game.data = [...new Set(wires)];
        },
        play: function (screen) {
            const wire = state.game.data;
            if (!wire) {
                return;
            }
            for (let i=0;i<wire.length;i++) {
                pressKey(wire[i].toString());
            }
        },
    },
];

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([
        ["start", false],
        ["stop", false],
        ["status", false],
        ["quiet", false],
    ]);

    function print(msg) {
        if (!args.quiet) {
            ns.tprint(`\n${msg}\n`);
        }
    }

    if (args.status) {
        if (wnd.tmrAutoInf) {
            print("Automated infiltration is active");
        } else {
            print("Automated infiltration is inactive");
        }
        return;
    }

    if (wnd.tmrAutoInf) {
        print("Stopping automated infiltration...");
        clearInterval(wnd.tmrAutoInf);
        delete wnd.tmrAutoInf;
    }

    if (args.stop) {
        return;
    }

    print(
        "Automated infiltration is enabled...\nVWhen you visit the infiltration screen of any company, all tasks are completed automatically."
    );

    endInfiltration();

    wnd.tmrAutoInf = setInterval(infLoop, speed);

    wrapEventListeners();
}

function infLoop() {
    if (!state.started) {
        waitForStart();
    } else {
        playGame();
    }
}


function getEl(parent, selector) {
    let prefix = ":scope";

    if ("string" === typeof parent) {
        selector = parent;
        parent = doc;

        prefix = ".MuiBox-root>.MuiBox-root>.MuiBox-root";

        if (!doc.querySelectorAll(prefix).length) {
            prefix = ".MuiBox-root>.MuiBox-root>.MuiGrid-root";
        }
        if (!doc.querySelectorAll(prefix).length) {
            prefix = ".MuiContainer-root>.MuiPaper-root";
        }
        if (!doc.querySelectorAll(prefix).length) {
            return [];
        }
    }

    selector = selector.split(",");
    selector = selector.map((item) => `${prefix} ${item}`);
    selector = selector.join(",");

    return parent.querySelectorAll(selector);
}


function filterByText(elements, text) {
    text = text.toLowerCase();

    for (let i = 0; i < elements.length; i++) {
        const content = elements[i].textContent.toLowerCase();

        if (-1 !== content.indexOf(text)) {
            return elements[i];
        }
    }

    return null;
}


function getLines(elements) {
    const lines = [];
    elements.forEach((el) => lines.push(el.textContent));

    return lines;
}


function endInfiltration() {
    unwrapEventListeners();
    state.company = "";
    state.started = false;
}


function pressKey(keyOrCode) {
    let keyCode = 0;
    let key = "";

    if ("string" === typeof keyOrCode && keyOrCode.length > 0) {
        key = keyOrCode.toLowerCase().substr(0, 1);
        keyCode = key.charCodeAt(0);
    } else if ("number" === typeof keyOrCode) {
        keyCode = keyOrCode;
        key = String.fromCharCode(keyCode);
    }

    if (!keyCode || key.length !== 1) {
        return;
    }

    function sendEvent(event) {
        const keyboardEvent = new KeyboardEvent(event, {
            key,
            keyCode,
        });

        doc.dispatchEvent(keyboardEvent);
    }

    sendEvent("keydown");
}


function waitForStart() {
    if (state.started) {
        return;
    }

    const h4 = getEl("h4");

    if (!h4.length) {
        return;
    }
    const title = h4[0].textContent;
    if (0 !== title.indexOf("Infiltrating")) {
        return;
    }

    const btnStart = filterByText(getEl("button"), "Start");
    if (!btnStart) {
        return;
    }

    state.company = title.substr(13);
    state.started = true;
    wrapEventListeners();

    console.log("Start automatic infiltration of", state.company);
    btnStart.click();
}


function playGame() {
    const screens = doc.querySelectorAll(".MuiContainer-root");

    if (!screens.length) {
        endInfiltration();
        return;
    }
    if (screens[0].children.length < 3) {
        return;
    }

    const screen = screens[0].children[2];
    const h4 = getEl(screen, "h4");

    if (!h4.length) {
        endInfiltration();
        return;
    }

    const title = h4[0].textContent.trim().toLowerCase().split(/[!.(]/)[0];

    if ("infiltration successful" === title) {
        endInfiltration();
        return;
    }

    if ("get ready" === title) {
        return;
    }

    const game = infiltrationGames.find((game) => game.name === title);

    if (game) {
        if (state.game.current !== title) {
            state.game.current = title;
            game.init(screen);
        }

        game.play(screen);
    } else {
        console.error("Unknown game:", title);
    }
}

function wrapEventListeners() {
    if (!doc._addEventListener) {
        doc._addEventListener = doc.addEventListener;

        doc.addEventListener = function (type, callback, options) {
            if ("undefined" === typeof options) {
                options = false;
            }
            let handler = false;

            if ("keydown" === type) {
                handler = function (...args) {
                    if (!args[0].isTrusted) {
                        const hackedEv = {};

                        for (const key in args[0]) {
                            if ("isTrusted" === key) {
                                hackedEv.isTrusted = true;
                            } else if ("function" === typeof args[0][key]) {
                                hackedEv[key] = args[0][key].bind(args[0]);
                            } else {
                                hackedEv[key] = args[0][key];
                            }
                        }

                        args[0] = hackedEv;
                    }

                    return callback.apply(callback, args);
                };

                for (const prop in callback) {
                    if ("function" === typeof callback[prop]) {
                        handler[prop] = callback[prop].bind(callback);
                    } else {
                        handler[prop] = callback[prop];
                    }
                }
            }

            if (!this.eventListeners) {
                this.eventListeners = {};
            }
            if (!this.eventListeners[type]) {
                this.eventListeners[type] = [];
            }
            this.eventListeners[type].push({
                listener: callback,
                useCapture: options,
                wrapped: handler,
            });

            return this._addEventListener(
                type,
                handler ? handler : callback,
                options
            );
        };
    }

    if (!doc._removeEventListener) {
        doc._removeEventListener = doc.removeEventListener;

        doc.removeEventListener = function (type, callback, options) {
            if ("undefined" === typeof options) {
                options = false;
            }

            if (!this.eventListeners) {
                this.eventListeners = {};
            }
            if (!this.eventListeners[type]) {
                this.eventListeners[type] = [];
            }

            for (let i = 0; i < this.eventListeners[type].length; i++) {
                if (
                    this.eventListeners[type][i].listener === callback &&
                    this.eventListeners[type][i].useCapture === options
                ) {
                    if (this.eventListeners[type][i].wrapped) {
                        callback = this.eventListeners[type][i].wrapped;
                    }

                    this.eventListeners[type].splice(i, 1);
                    break;
                }
            }

            if (this.eventListeners[type].length == 0) {
                delete this.eventListeners[type];
            }

            return this._removeEventListener(type, callback, options);
        };
    }
}

function unwrapEventListeners() {
    if (doc._addEventListener) {
        doc.addEventListener = doc._addEventListener;
        delete doc._addEventListener;
    }
    if (doc._removeEventListener) {
        doc.removeEventListener = doc._removeEventListener;
        delete doc._removeEventListener;
    }
    delete doc.eventListeners;
}