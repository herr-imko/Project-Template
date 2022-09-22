class InputContollerGroup {

	#Slave = class {
		/**
		 *
		 * @param {HTMLElement} element
		 */
		constructor(element) {
			this.element = element
			// this.isInverted = element.dataset.controlInverted
			this.controlType = element.dataset.controlType ? element.dataset.controlType : "disable"
			this.requireds = [...element.querySelectorAll("*:required")]
			if (element.required) {
				this.requireds.push(this.element)
			}
		}

		toggleSelf() {
			switch (this.controlType) {
				case "display": {
					this.element.classList.toggle("hidden")
					break
				}
				case "disable": {
					this.element.toggleAttribute("disabled")
					break
				}
			}
		}

		toggleRequired() {
			this.requireds.forEach(element => {
				element.toggleAttribute("required")
			})
		}

		toggleAll() {
			this.toggleSelf()
			this.toggleRequired()
		}
	}
	/**
	 *
	 * @param {Array<HTMLElement>} members
	 */
	constructor(members) {
		this.masters = members.filter((element) => {
			return element.dataset.controlMode == "master"
		})

		this.slaves = members.filter((element) => {
			return element.dataset.controlMode == "slave"
		}).map((curr) => {
			return new this.#Slave(curr)
		})

		this.#bindEvents()
	}


	#bindEvents = () => {
		this.masters.forEach(master => {
			master.addEventListener("change", () => {
				this.slaves.forEach(slave => {
					slave.toggleAll()
				})
			})
		})
	}

	static findGroups = function () {
		return Object.values([...document.querySelectorAll("[data-control-group]")].reduce((acc, curr) => {
			let groupname = curr.dataset.controlGroup
			acc[groupname] ? acc[groupname].push(curr) : acc[groupname] = [curr]
			return acc
		}, {}))
	}
}

export default InputContollerGroup
