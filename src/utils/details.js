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
    scale: [16, 14.1, 17.5],
    position: [-1.6, -1.5, 0.2],
    levels: [
      {
        name: 'Foxconn K8S755M-6ELRS',
        file: 'model2_pcb'
      },
      {
        name: 'TR121-(Bridge-Sata4)',
        file: 'model2_track1'
      },
      {
        name: 'TR243-(Mem-Proc)',
        file: 'model2_track2'
      }
    ]
  }
];
