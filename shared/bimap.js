// an immutable bidirectional map of string <-> number
class StrNbrBiMap { // needs to be sublassed in order to be filled with data
	constructor() {
		this._strNbr = {};
		this._nbrStr = [];
	}
	getNbr(str) {
		return this._strNbr[str];
	}
	*[Symbol.iterator]() {
		for (let key in this._strNbr) {
			yield {
				str: key,
				nbr: this._strNbr[key]
			};
		}
	}
}

export class EnumMap extends StrNbrBiMap {
	// the numbers corresponding to each strings are like those of an enum, starting at 0 with a step of 1
	constructor(...fields) {
		super();

		let val = 0;
		for (let field of fields) {
			this._strNbr[field] = val;
			this._nbrStr.push(field);
			++val;
		}
	}
	getStr(nbr) {
		return this._nbrStr[nbr];
	}
}
export class BitmaskMap extends StrNbrBiMap {
	// the numbers corresponding to each strings are like those of an bitmask, 0b000000001 -> 0b00000010 -> 0b000000100 -> 0b00001000 -> etc. You get the point
	constructor(...fields) {
		super();

		let val = 1;
		for (let field of fields) {
			this._strNbr[field] = val;
			this._nbrStr.push(field);
			val <<= 1;
		}
	}
	getStr(nbr) {
		return this._nbrStr[Math.log2(nbr)];
	}
}

// a mutable bidirectional map of string <-> string
// an action can be mapped to multiple keyboard keys, but a keyboard key can only be mapped to one action
export class KeyActionMap { // note: `key` here does not refer to a key as in 'key <-> value' but as in 'keyboard key'
	constructor(str) {
		this._actions = {};
		this._keys = {};

		if (str !== undefined) this.parse(str);
	}
	addMapping(action, key) {
		if (this._keys[key] !== undefined) throw new Error('Key `' + key + '` is already assigned to the action `' + this._keys[key] + '`');

		if (this._actions[action] === undefined) this._actions[action] = new Set();

		this._actions[action].add(key);
		this._keys[key] = action;
	}
	deleteKey(key) {
		this._actions[this._keys[key]].delete(key);
		delete this._keys[key];
	}
	getAction(key) {
		return this._keys[key];
	}
	getKeys(action) {
		return this._actions[action];
	}
	stringify() {
		JSON.stringify(this._keys);
	}
	parse(str) {
		this._keys = JSON.parse(str);
		for (let key in this._keys) {
			let action = this._keys[key];
			if (this._actions[action] === undefined) this._actions[action] = new Set();
			this._actions[action].add(key);
		}
	}
}
