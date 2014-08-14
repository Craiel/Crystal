define(function() { return {
	
	Buildings: {
		0: {
			id: 'basicImplant',
			name: 'Basic Implant',
			baseCost: 10,
			costMultiplier: 0.2,
			forManual: true,
			effects: {
				gainIncrease: 1,
			},
		},
		1: {
			id: 'basicReactor',
			name: 'Basic Reactor',
			baseCost: 100,
			costMultiplier: 0.5,
			effects: {
				powerIncrease: 50,
			},
		},
		2: {
			id: 'basicAssembler',
			name: 'Basic Assembler',
			baseCost: 20,
			costMultiplier: 0.2,
			effects: {
				gainIncrease: 1,
				powerDecrease: 5,
			}
		},
		3: {
			id: 'basicProcessor',
			name: 'Basic Processor',
			baseCost: 200,
			costMultiplier: 0.6,
			effects: {
				intervalDecreasePercent: 5,
				gainIncreasePercent: 1,
				powerDecrease: 2,
			}
		}
	},
	
	Upgrades: {
		0: {
			id: 'implantAugmentation',
			name: 'Implant augmentation',
			baseCost: 100,
			targetBuildings: [0],
			choices: {
				0: {
					id: 'implantAugmentationPower',
					name: 'Power',
					effects: {
						gainIncrease: 1,
					}
				},
				1: {
					id: 'implantAugmentationConstruction',
					name: 'Construction',
					effects: {
						costDecreasePercent: 10,
					}
				}
			}
		},
		1: {
			id: 'reactorAugmentation',
			name: 'Reactor augmentation',
			baseCost: 1000,
			targetBuildings: [1],
			choices: {
				0: {
					id: 'reactorAugmentationPower',
					name: 'Power',
					effects: {
						powerIncrease: 1,
					}
				},
				1: {
					id: 'reactorAugmentationConstruction',
					name: 'Construction',
					effects: {
						costDecreasePercent: 10,
					}
				},
			}
		},
		2: {
			id: 'assemblerAugmentation',
			name: 'Assembler augmentation',
			baseCost: 1000,
			targetBuildings: [2],
			choices: {
				0: {
					id: 'assemblerAugmentationPower',
					name: 'Power',
					effects: {
						gainIncrease: 1,
					}
				},
				1: {
					id: 'reactorAugmentationConstruction',
					name: 'Construction',
					effects: {
						costDecreasePercent: 10,
					}
				},
				2: {
					id: 'reactorAugmentationEfficiency',
					name: 'Efficiency',
					effects: {
						powerIncrease: 2,
					}
				},
			}			
		}
	},
	
}; });