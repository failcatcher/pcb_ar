export default [
  {
    id: 1,
    name: 'Intel MSQFD',
    // pattern: 'model1',
    levels: [
      {
        name: 'Intel MSQFD',
        file: 'level1'
      }
    ]
  },
  {
    id: 'model2_pcb',
    name: 'Foxconn K8S755M-6ELRS',
    // pattern: 'model2_pcb',
    scale: [2.8, 2.8, 2.8],
    position: [0, 0, 0],
    levels: [
      {
        name: 'Foxconn K8S755M-6ELRS',
        file: 'model2_pcb'
      },
      {
        name: 'South_bridge-Sata4',
        file: 'model2_track1'
      },
      {
        name: 'Memory-Processor',
        file: 'model2_track2'
      }
    ]
  }
];
