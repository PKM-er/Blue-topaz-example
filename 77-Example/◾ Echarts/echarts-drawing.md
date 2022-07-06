---
---
```dataviewjs
const echarts = app.plugins.plugins['obsidian-echarts'].echarts()
let option = {
        title: {
            text: '孤帆远影碧空尽,唯见长江天际流',
            textStyle: {
                color: '#555'
            }
        },
        grid: {
            left: '0',
            right: '0',
            bottom: '1%'
        },
        backgroundColor: new echarts.graphic.RadialGradient(0.62, 0.45, 1, [{
            offset: 0,
            color: '#fe9e80'
        }, {
            offset: 1,
            color: '#9bc9f1'
        }], false),
        xAxis: [{
            boundaryGap: false,
            data: new Array(15),
            splitLine: {
                show: false
            }
        }],
        yAxis: [{
            min: 0,
            max: 10,
            type: 'value',
            splitLine: {
                show: false
            }

        }],
        series: [{
            //mountain background
            type: 'line',
            areaStyle: {
                normal: {
                    color: '#2a9c91',
                    opacity: 0.4
                }
            },
            data: [5, 5, 5, 6.1, 6.2, 6.3, 6.4, 6, 4, 4, 4, 4, 4, 4, 4],
            symbolSize: 0,
            lineStyle: {
                normal: {
                    width: 0
                }
            }
        }, {
            //mountain behind
            type: 'line',
            areaStyle: {
                normal: {
                    color: '#2a9c91',
                    opacity: 0.8
                }
            },
            data: [4, 4, 4, 4, 4, 4, 4, 4, 3, 4.5, 5, 6, 6.5, 7, 7.2],
            symbolSize: 0,
            lineStyle: {
                normal: {
                    width: 0
                }
            }
        }, {
            //river behind
            type: 'line',
            areaStyle: {
                normal: {
                    color: '#2dc3b5',
                    opacity: 1
                }
            },
            data: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            symbolSize: 0,
            lineStyle: {
                normal: {
                    width: 0
                }
            }
        }, {
            //mountain left
            type: 'line',
            areaStyle: {
                normal: {
                    color: '#0f6960',
                    opacity: 1
                }
            },
            data: [6.5, 6, 6, 6, 5.8, 5.2, 4.8, 4.2, 2, 0, 0, 0, 0, 0, 0],
            symbolSize: 0,
            lineStyle: {
                normal: {
                    width: 0
                }
            }
        }, {
            //river middle
            type: 'line',
            areaStyle: {
                normal: {
                    color: '#2dc3b5',
                    opacity: 1
                }
            },
            data: [2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8],
            symbolSize: 0,
            lineStyle: {
                normal: {
                    width: 0
                }
            }
        }, {
            //mountain right
            type: 'line',
            areaStyle: {
                normal: {
                    color: '#0f6960',
                    opacity: 1
                }
            },
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4.8, 5, 5.5],
            symbolSize: 0,
            lineStyle: {
                normal: {
                    width: 0
                }
            }
        }, {
            //river front
            type: 'line',
            areaStyle: {
                normal: {
                    color: '#2dc3b5',
                    opacity: 0.8
                }
            },
            data: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            smooth: true,
            smoothMonotone: 'x',
            symbolSize: 0,
            lineStyle: {
                normal: {
                    width: 0
                }
            },
            animationDelayUpdate: function(idx) {
                return idx * 5;
            }
        }, {
            type: 'graph',
            data: [{
                    symbolSize: 0,
                    x: 0,
                    y: 0
                }, {
                    symbolSize: 0,
                    x: 200,
                    y: 100
                },
                //sun
                {
                    symbolSize: 100,
                    x: 130,
                    y: 45
                },
                //sun shadow
                {
                    symbolSize: [40, 10],
                    symbolOffset: [0, 180],
                    x: 130,
                    y: 45,
                    itemStyle: {
                        normal: {
                            opacity: 0.2
                        }
                    },
                }, {
                    symbolSize: [100, 30],
                    symbolOffset: [0, 200],
                    x: 130,
                    y: 45,
                    itemStyle: {
                        normal: {
                            opacity: 0.25
                        }
                    },
                }, {
                    symbolSize: [60, 20],
                    symbolOffset: [0, 225],
                    x: 130,
                    y: 45,
                    itemStyle: {
                        normal: {
                            opacity: 0.2
                        }
                    },
                }, {
                    symbolSize: [20, 10],
                    symbolOffset: [0, 245],
                    x: 130,
                    y: 45,
                    itemStyle: {
                        normal: {
                            opacity: 0.2
                        }
                    },
                }
            ],
            itemStyle: {
                normal: {
                    color: '#ff5722',
                    shadowColor: '#ff5722',
                    shadowBlur: 100
                }
            },
            silent: true,
            z: 3
        }, {
            //boat
            type: 'graph',
            data: [{
                    symbolSize: 0,
                    x: 0,
                    y: 0
                }, {
                    symbolSize: 0,
                    x: 200,
                    y: 100
                }, {
                    symbolSize: [35, 40],
                    symbolOffset: [20, 120],
                    x: 130,
                    y: 45,
                    itemStyle: {
                        normal: {
                            color: '#333',
                        }
                    },
                    symbol: 'path://M27.310007,2.749997l22.5,0c-2.485281,0 -4.5,14.326891 -4.5,32.000002c0,17.673113 2.014718,32 4.5,32l-22.5,0l0,0c-2.485281,0 -4.5,-14.326889 -4.5,-32c0,-17.673111 2.014718,-32.000002 4.5,-32.000002z M12.75,70.184998l47,0l-11,10l-30,-1l-6,-9z',
                }, {
                    //boat shadow
                    symbolSize: [30, 5],
                    symbolOffset: [19, 142],
                    x: 130,
                    y: 45,
                    itemStyle: {
                        normal: {
                            color: '#333',
                            opacity: 0.1
                        }
                    },
                    symbol: 'roundRect'
                }, {
                    symbolSize: [18, 15],
                    x: 130,
                    y: 45,
                    itemStyle: {
                        normal: {
                            color: '#333',
                            opacity: 0.1
                        }
                    },
                    symbolRotate: 2,
                    symbolOffset: [20, 151],
                    symbol: 'roundRect'
                },
                //wave
                {
                    name: 'wave1',
                    symbolSize: 0,
                    x: 126,
                    y: 86
                }, {
                    name: 'wave2',
                    symbolSize: 0,
                    x: 130,
                    y: 86
                }, {
                    name: 'wave3',
                    symbolSize: 0,
                    x: 130,
                    y: 93
                }, {
                    name: 'wave4',
                    symbolSize: 0,
                    x: 134,
                    y: 93
                }, {
                    name: 'wave5',
                    symbolSize: 0,
                    x: 144,
                    y: 90
                }, {
                    name: 'wave6',
                    symbolSize: 0,
                    x: 148,
                    y: 90
                }
            ],
            links: [{
                source: 'wave1',
                target: 'wave2'
            }, {
                source: 'wave3',
                target: 'wave4'
            }, {
                source: 'wave5',
                target: 'wave6'
            }],
            lineStyle: {
                normal: {
                    width: 1,
                    curveness: 0.45,
                    color: '#0f6960'
                }
            },
            silent: true,
            symbolRotate: -2,
            z: 3
        }, {
            //birds
            type: 'graph',
            data: [
                //bg
                {
                    symbolSize: 0,
                    x: 0,
                    y: 0,
                }, {
                    symbolSize: 0,
                    x: 200,
                    y: 100,
                },
                //bird1
                {
                    symbolSize: 0,
                    x: 120,
                    y: 50,
                    name: 'first-bird-left'
                }, {
                    symbolSize: 3,
                    x: 125,
                    y: 52,
                    name: 'first-bird'
                }, {
                    symbolSize: 0,
                    x: 130,
                    y: 50,
                    name: 'first-bird-right'
                },
                //bird2
                {
                    symbolSize: 0,
                    x: 110,
                    y: 43,
                    name: 'second-bird-left'
                }, {
                    symbolSize: 2,
                    x: 115,
                    y: 45,
                    name: 'second-bird'
                }, {
                    symbolSize: 0,
                    x: 120,
                    y: 43,
                    name: 'second-bird-right'
                },
                //bird3
                {
                    symbolSize: 0,
                    x: 112,
                    y: 52,
                    name: 'third-bird-left'
                }, {
                    symbolSize: 2,
                    x: 115,
                    y: 53,
                    name: 'third-bird'
                }, {
                    symbolSize: 0,
                    x: 118,
                    y: 52,
                    name: 'third-bird-right'
                }
            ],
            links: [{
                source: 'first-bird-left',
                target: 'first-bird'
            }, {
                source: 'first-bird',
                target: 'first-bird-right'
            }, {
                source: 'second-bird-left',
                target: 'second-bird'
            }, {
                source: 'second-bird',
                target: 'second-bird-right'
            }, {
                source: 'third-bird-left',
                target: 'third-bird'
            }, {
                source: 'third-bird',
                target: 'third-bird-right'
            }, ],
            lineStyle: {
                normal: {
                    width: 1,
                    curveness: 0.3,
                    color: '#333'
                }
            },
            itemStyle: {
                normal: {
                    color: '#555'
                }
            },
            silent: true,
            z: 4
        }]
    };
  
app.plugins.plugins['obsidian-echarts'].render(option, this.container)


```