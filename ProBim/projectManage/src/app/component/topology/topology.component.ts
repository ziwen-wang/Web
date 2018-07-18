import {Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild, AfterViewInit} from '@angular/core';

import {DomHandler} from 'primeng/primeng';

declare let d3;

interface SectionNode {
  modelId: string;
  name: string;
  id: string;
  image: string;
  parent: SectionNode;
  children: any[];
  imageSelected: string;
  imageUp: string;
  imageDown: string;
  isUsed: boolean;
}

interface SectionLine {
  source: number;
  target: number;
  relation: string;
  isUsed: boolean;
}

@Component({
  selector: 'bim-topology',
  templateUrl: './topology.component.html',
  styleUrls: ['./topology.component.scss'],
  providers: [DomHandler]
})
export class TopologyComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() systemInfo: any;

  @Input() systemElementId2Info: any;

  @Input() modelId: string;

  @Output() selectedNode: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('content') contentElementRef: ElementRef;

  public sectionNodes: SectionNode[];

  public sectionLines: SectionLine[];

  public root: SectionNode;

  public node2Index: Map<string, number>;

  public elementId2OutConnection: Map<string, string[]>;

  public elementId2InConnection: Map<string, string[]>;

  public elementId2BidirectionalConnection: Map<string, string[]>;

  public elementId2: Map<string, string[]>;

  public elementId2IsMain: Map<string, boolean>;

  public arrow_path = 'M2,2 L2,11 L10,6 L2,2';

  public svg: any;

  public zoom: any;

  public group: any;

  public img_w: number;
  public img_h: number;

  public nodes_text: any;
  public nodes_img: any;
  public node_link: any;
  public currentNodeId: string;

  public parentNodeIds: string[];
  public childrenNodeIds: string[];

  public baseEquipmentID: string;

  public equipmentImagePath: string;
  public equipmentImagePathSelect: string;
  public endImagePath: string;
  public componentImagePath: string;
  public componentImagePathSelect: string;
  public upImage: string;
  public downImage: string;
  public artboard: string;

  private depth: number;

  private maines: string[];

  private equipment: string[];

  constructor(private domHandler: DomHandler) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sectionNodes = null;
    this.sectionLines = null;
    this.root = null;
    this.node2Index = null;
    this.elementId2OutConnection = null;
    this.elementId2InConnection = null;
    this.elementId2 = null;
    this.elementId2IsMain = null;
    this.arrow_path = null;
    this.svg = null;
    this.zoom = null;
    this.group = null;
    this.img_w = null;
    this.img_h = null;
    this.nodes_text = null;
    this.nodes_img = null;
    this.node_link = null;
    this.currentNodeId = null;
    this.parentNodeIds = null;
    this.childrenNodeIds = null;
    this.baseEquipmentID = null;
    this.equipmentImagePath = null;
    this.endImagePath = null;
    this.componentImagePath = null;
  }

  ngAfterViewInit() {
    this.init();
  }

  public init() {
    this.equipmentImagePath = (window as any).bim_config.filePath + '/images/BIMSystem/topology/topology-equipment.png';
    this.endImagePath = (window as any).bim_config.filePath + '/images/BIMSystem/topology/topology-end.png';
    this.componentImagePath = (window as any).bim_config.filePath + '/images/BIMSystem/topology/topology-component.png';
    this.equipmentImagePathSelect = (window as any).bim_config.filePath + '/images/BIMSystem/topology/topology-equipment_selected.png';
    this.componentImagePathSelect = (window as any).bim_config.filePath + '/images/BIMSystem/topology/topology-component_selected.png';
    this.upImage = (window as any).bim_config.filePath + '/images/BIMSystem/topology/topology-up.png';
    this.downImage = (window as any).bim_config.filePath + '/images/BIMSystem/topology/topology-down.png';
    this.artboard = (window as any).bim_config.filePath + '/images/BIMSystem/topology/topology-artboard.png';
    this.maines = ['OST_PlaceHolderDucts',
      'OST_PipeAccessory',
      'OST_DuctFitting',
      'OST_DuctFittingLining',
      'OST_SpecialityEquipment',
      'OST_DuctTerminal',
      'OST_ConduitFitting',
      'OST_LightingDevices',
      'OST_FireAlarmDevices',
      'OST_SecurityDevices',
      'OST_TelephoneDevices',
      'OST_ConnectorElem',
      'OST_MechanicalEquipment',
      'OST_PlaceHolderPipes',
      'OST_Sprinklers',
      'OST_PipeFitting',
      'OST_PlumbingFixtures',
      'OST_DuctAccessory'];
    this.equipment = [];
    this.baseEquipmentID = '';
    this.img_w = 30;
    this.img_h = 30;
    this.dealNode();
    if (this.sectionNodes.length !== 0) {
      this.dealLines();
      this.createRootTree();
      this.createSVG();
      this.createGroup();
      this.createArrow();
      this.createD3Tree();
    }
  }

  /**
   * 得到图谱图所有的节点
   * @returns {SectionNode[]}
   */
  public dealNode() {
    if (this.systemInfo.Section === '') {
      return;
    }
    this.elementId2IsMain = new Map<string, boolean>();
    this.elementId2InConnection = new Map<string, string[]>();
    this.elementId2OutConnection = new Map<string, string[]>();
    this.elementId2BidirectionalConnection = new Map<string, string[]>();
    this.node2Index = new Map<string, number>();
    this.sectionNodes = [];
    this.baseEquipmentID = '-1';
    let sectiones = [];
    let flag = true;
    for (let system of this.systemInfo) {
      if (system.Section !== '') {
        sectiones.push(...JSON.parse(system.Section));
        if (system.BaseEquipmentID !== '-1' && flag) {
          this.baseEquipmentID = system.BaseEquipmentID;
          flag = false;
        }
      }
    }
    for (let section of sectiones) {
      for (let element2connector of section.element2connector) {
        let elementInfo = this.systemElementId2Info.get(element2connector.id);
        if (elementInfo === undefined) {
          continue;
        }
        let isMain = false;
        if ((this.maines.indexOf((elementInfo as any).CategoryID) > -1 || this.baseEquipmentID.indexOf(element2connector.id) !== -1)) {
          if ((elementInfo as any).CategoryID === 'OST_MechanicalEquipment') {
            this.equipment.push(element2connector.id);
          }
          isMain = true;
        }
        this.elementId2IsMain.set(element2connector.id, isMain);
        if (isMain) {
          let node: SectionNode = {
            modelId: this.modelId,
            name: (elementInfo as any).Name,
            id: element2connector.id,
            parent: null,
            image: this.equipment.indexOf(element2connector.id) !== -1 ? this.equipmentImagePath : this.componentImagePath,
            imageSelected: this.equipment.indexOf(element2connector.id) !== -1 ? this.equipmentImagePathSelect : this.componentImagePathSelect,
            imageUp: this.upImage,
            imageDown: this.downImage,
            children: [],
            isUsed: false
          };
          if (!this.node2Index.has(node.id)) {
            this.sectionNodes.push(node);
            this.node2Index.set(node.id, this.sectionNodes.length - 1);
          }
        }
      }
      for (let connector of section.element2connector) {
        for (let inConnector of connector.inconnector) {
          let inConnectors;
          if (this.elementId2InConnection.has(connector.id)) {
            inConnectors = this.elementId2InConnection.get(connector.id);
            if (inConnectors.indexOf(inConnector.id) === -1) {
              inConnectors.push(inConnector.id);
            }

          } else {
            inConnectors = [];
            inConnectors.push(inConnector.id);
            this.elementId2InConnection.set(connector.id, inConnectors);
          }
        }
        for (let outconnector of connector.outconnector) {
          let outConnectors;
          if (this.elementId2OutConnection.has(connector.id)) {
            outConnectors = this.elementId2OutConnection.get(connector.id);
            if (outConnectors.indexOf(outconnector.id) === -1) {
              outConnectors.push(outconnector.id);
            }
          } else {
            outConnectors = [];
            outConnectors.push(outconnector.id);
            this.elementId2OutConnection.set(connector.id, outConnectors);
          }
        }

        for (let bidirectionalConnector of connector.bidirectionalconnector) {
          let bidirectional;
          if (this.elementId2BidirectionalConnection.get(connector.id)) {
            bidirectional = this.elementId2BidirectionalConnection.get(connector.id);
            if (bidirectional.indexOf(bidirectionalConnector.id) === -1) {
              bidirectional.push(bidirectionalConnector.id);
            }
          } else {
            bidirectional = [];
            bidirectional.push(bidirectionalConnector.id);
            this.elementId2BidirectionalConnection.set(connector.id, bidirectional);
          }
        }
      }
    }
  }

  /**
   * 得到拓扑图所有的连线
   * @returns {SectionLine[]}
   */
  public dealLines() {
    this.sectionLines = [];
    for (let node of this.sectionNodes) {
      let index = this.node2Index.get(node.id);
      let outConnectores = this.elementId2OutConnection.get(node.id);
      if (outConnectores !== undefined) {
        for (let outConnector of outConnectores) {
          if (this.elementId2IsMain.get(outConnector) === false) {
            this.getOutConnection(outConnector, index);
          } else {
            let sectionLine = {
              source: this.node2Index.get(outConnector),
              target: index,
              relation: '',
              isUsed: false
            };
            this.sectionLines.push(sectionLine);
          }
        }
      }
      let inConnectores = this.elementId2InConnection.get(node.id);
      if (inConnectores !== undefined) {
        for (let inConnector of inConnectores) {
          if (this.elementId2IsMain.get(inConnector) === false) {
            this.getInConnection(inConnector, index);
          } else {
            let sectionLine = {
              source: index,
              target: this.node2Index.get(inConnector),
              relation: '',
              isUsed: false
            };
            this.sectionLines.push(sectionLine);
          }
        }
      }

      let bidirectionalConnectores = this.elementId2BidirectionalConnection.get(node.id);
      if (bidirectionalConnectores !== undefined) {
        for (let bidirectionalConnector of bidirectionalConnectores) {
          if (bidirectionalConnector === node.id) {
            continue;
          }
          if (this.elementId2IsMain.get(bidirectionalConnector) === false) {
            this.getBidirectionalConnection(bidirectionalConnector, index, node.id);
          } else {
            let sectionLine = {
              source: index,
              target: this.node2Index.get(bidirectionalConnector),
              relation: '',
              isUsed: false
            };
            this.sectionLines.push(sectionLine);
          }
        }
      }

    }
    let lines: Set<string> = new Set<string>();
    let sectionLines = this.sectionLines;
    this.sectionLines = [];
    for (let line of sectionLines) {
      if (line.source === undefined || line.target === undefined) {
        continue;
      }
      let sourceAndTarget = line.source.toString() + '_' + line.target.toString();
      if (lines.has(sourceAndTarget)) {
        continue;
      }
      lines.add(sourceAndTarget);
      this.sectionLines.push(line);
    }
  }

  /**
   *
   * @param elementId
   * @param index
   */
  public getOutConnection(elementId: string, index: number) {
    let outConnectores = this.elementId2OutConnection.get(elementId);
    if (outConnectores !== undefined) {

      for (let outConnector of outConnectores) {
        if (this.elementId2IsMain.get(outConnector) === false) {
          this.getOutConnection(outConnector, index);
        } else {
          let sectionLine = {
            source: this.node2Index.get(outConnector),
            target: index,
            relation: '',
            isUsed: false
          };
          this.sectionLines.push(sectionLine);
        }
      }
    }
  }

  public getInConnection(elementId: string, index: number) {
    let inConnectores = this.elementId2InConnection.get(elementId);
    if (inConnectores !== undefined) {
      for (let inConnector of inConnectores) {
        if (this.elementId2IsMain.get(inConnector) === false) {
          this.getInConnection(inConnector, index);
        } else {
          let sectionLine = {
            source: index,
            target: this.node2Index.get(inConnector),
            relation: '',
            isUsed: false
          };
          this.sectionLines.push(sectionLine);
        }
      }
    }

  }

  public getBidirectionalConnection(elementId: string, index: number, parentId: string) {
    let bidirectionalConnectores = this.elementId2BidirectionalConnection.get(elementId);
    if (bidirectionalConnectores !== undefined) {
      for (let bidirectionalConnector of bidirectionalConnectores) {
        if (parentId === bidirectionalConnector) {
          continue;
        }
        if (this.elementId2IsMain.get(bidirectionalConnector) === false) {
          this.getBidirectionalConnection(bidirectionalConnector, index, elementId);
        } else {
          let sectionLine = {
            source: index,
            target: this.node2Index.get(bidirectionalConnector),
            relation: '',
            isUsed: false
          };
          this.sectionLines.push(sectionLine);
        }
      }
    }
  }

  public clickNode(event) {
    if (event.id !== '') {
      this.parentNodeIds = [];
      this.childrenNodeIds = [];
      this.currentNodeId = event.id;
      this.getParentNodeIds(event);
      this.getChildrenNodeIds(event);
      this.selectedNode.emit(event.modelId + '^' + event.id);
      this.nodes_img.attr('xlink:href', (d) => {
        if (d.id !== '') {
          if (d.id === this.currentNodeId) {
            return d.imageSelected;
          } else {
            return d.image;
          }
        } else {
          return d.image;
        }
      })
        .attr('width', (d) => {
          return this.img_w;
        })
        .attr('height', (d) => {
          return this.img_w;
        })
        .attr('x', (d) => {
          if (d.id === '') {
            if (d.name === 'left') {
              return event.x - 50;
            } else {
              return event.x + 20;
            }
          } else {
            return d.x - 15;
          }
        })
        .attr('y', (d) => {
          if (d.id === '') {
            return event.y - 15;
          } else {
            return d.y - 15;
          }
        });
    } else {
      let parentIds = [];
      parentIds.push(this.currentNodeId);
      parentIds.push(...this.parentNodeIds);

      let childrenIds = [];
      childrenIds.push(this.currentNodeId);
      childrenIds.push(...this.childrenNodeIds);

      let lines = [];

      this.node_link.style('stroke', (line) => {
        let ids = [];
        if (event.name === 'left') {
          ids.push(...parentIds);
        } else {
          ids.push(...childrenIds);
        }
        if (ids.indexOf(line.source.id) > -1 && ids.indexOf(line.target.id) > -1) {
          return 'red';
        } else {
          return '#3399C5';
        }
      }).attr('marker-end', (line) => {
        let ids = [];
        if (event.name === 'left') {
          ids.push(...parentIds);
        } else {
          ids.push(...childrenIds);
        }
        if (ids.indexOf(line.source.id) > -1 && ids.indexOf(line.target.id) > -1) {
          lines.push(line);
          return 'url(#arrowRed)';
        } else {
          return 'url(#arrow)';
        }
      });

      let elementIds = this.getLineIds(lines);

      let ids = [];
      if (event.name === 'left') {
        ids.push(...this.parentNodeIds);
      } else {
        ids.push(...this.childrenNodeIds);
      }

      this.nodes_img.attr('xlink:href', (d) => {
        if (ids.indexOf(d.id) > -1 || d.id === this.currentNodeId) {
          elementIds.push(d.modelId + '^' + d.id);
          return d.imageSelected;
        } else {
          return d.image;
        }
      });

      let tempElementIds = [];
      for (let elementId of elementIds) {
        let targetIds = this.elementId2BidirectionalConnection.get(elementId.split('^')[1]);
        if (targetIds !== undefined) {
          for (let targetId of targetIds) {
            if (elementIds.indexOf(elementId.split('^')[0] + '^' + targetId) === -1) {
              tempElementIds.push(elementId.split('^')[0] + '^' + targetId);
            }
          }
        }
        targetIds = this.elementId2InConnection.get(elementId.split('^')[1]);
        if (targetIds !== undefined) {
          for (let targetId of targetIds) {
            if (elementIds.indexOf(elementId.split('^')[0] + '^' + targetId) === -1) {
              tempElementIds.push(elementId.split('^')[0] + '^' + targetId);
            }
          }
        }
        targetIds = this.elementId2OutConnection.get(elementId.split('^')[1]);
        if (targetIds !== undefined) {
          for (let targetId of targetIds) {
            if (elementIds.indexOf(elementId.split('^')[0] + '^' + targetId) === -1) {
              tempElementIds.push(elementId.split('^')[0] + '^' + targetId);
            }
          }
        }
      }

      for (let tempElementId of tempElementIds) {
        let targetIds = this.elementId2BidirectionalConnection.get(tempElementId.split('^')[1]);
        if (targetIds !== undefined) {
          if (targetIds.length === 1) {
            elementIds.push(tempElementId);
          }
        }
        targetIds = this.elementId2InConnection.get(tempElementId.split('^')[1]);
        if (targetIds !== undefined) {
          if (targetIds.length === 1) {
            elementIds.push(tempElementId);
          }
        }
        targetIds = this.elementId2OutConnection.get(tempElementId.split('^')[1]);
        if (targetIds !== undefined) {
          if (targetIds.length === 1) {
            elementIds.push(tempElementId);
          }
        }

      }
    }
  }

  public createD3Tree() {
    let width = this.domHandler.getWidth(this.contentElementRef.nativeElement);
    if (width === 0) {
      width = (window.innerWidth - 120) / 12 * 8;
    }
    let tree = d3.layout.tree()
      .nodeSize([50, 100])
      .separation(function (a, b) {
        return (a.parent === b.parent ? 1 : 2);
      });
    let nodes = tree.nodes(this.root);
    nodes.forEach(function (d) {
      d.x = d.x + width / 2;
      d.y = d.y + 50;
    });
    let links = tree.links(nodes);
    this.createD3NodeText(nodes);
    let d3Nodes = [];
    d3Nodes.push(...nodes);

    // let leftRoot = {
    //   modelId: '',
    //   name: 'left',
    //   id: '',
    //   image: this.upImage,
    //   parent: null,
    //   x: 120,
    //   y: 0,
    //   children: []
    // };
    // let rightRoot = {
    //   modelId: '',
    //   name: 'right',
    //   id: '',
    //   image: this.downImage,
    //   parent: null,
    //   x: 150,
    //   y: 0,
    //   children: []
    // };
    //
    // d3Nodes.push(leftRoot);
    // d3Nodes.push(rightRoot);
    this.createD3Nodes(d3Nodes);
    this.createD3Lines(links);

  }

  public createRootTree() {
    this.depth = 1;
    if (this.baseEquipmentID !== '-1') {
      for (let sectionNode of this.sectionNodes) {
        if (this.baseEquipmentID.indexOf(sectionNode.id) !== -1) {
          sectionNode.isUsed = true;
          this.root = {
            modelId: sectionNode.modelId,
            name: sectionNode.name,
            id: sectionNode.id,
            image: sectionNode.image,
            imageSelected: sectionNode.imageSelected,
            imageUp: sectionNode.imageUp,
            imageDown: sectionNode.imageDown,
            parent: null,
            children: [],
            isUsed: false
          };
          this.createChildTreeNode(this.root.children, this.root, this.node2Index.get(this.root.id), 1);
        }
      }

    } else {
      let sectionNode = this.sectionNodes[this.sectionNodes.length - 1];
      // for (let sectionNodeiii of this.sectionNodes) {
      //   if (sectionNodeiii.id === '3388166') {
      //     sectionNode = sectionNodeiii;
      //   }
      // }

      sectionNode.isUsed = true;
      this.root = {
        modelId: sectionNode.modelId,
        name: sectionNode.name,
        id: sectionNode.id,
        image: sectionNode.image,
        imageSelected: sectionNode.imageSelected,
        imageUp: sectionNode.imageUp,
        imageDown: sectionNode.imageDown,
        parent: null,
        children: [],
        isUsed: false
      };
      this.createChildTreeNode(this.root.children, this.root, this.node2Index.get(this.root.id), 1);
    }
  }

  public createChildTreeNode(children, parent, index, depth) {
    let currentDepth = depth + 1;
    if (this.depth < currentDepth) {
      this.depth = currentDepth;
    }
    for (let line of this.sectionLines) {
      if (line.isUsed === false) {
        if (line.source === index) {
          line.isUsed = true;
          let node = this.sectionNodes[line.target];
          if (node.isUsed === false) {
            node.isUsed = true;
            let childNode: SectionNode = {
              modelId: node.modelId,
              name: node.name,
              id: node.id,
              image: node.image,
              imageSelected: node.imageSelected,
              imageUp: node.imageUp,
              imageDown: node.imageDown,
              parent: parent,
              children: [],
              isUsed: false
            };
            children.push(childNode);
            this.createChildTreeNode(childNode.children, childNode, line.target, currentDepth);
          }

        }

        if (line.target === index) {
          line.isUsed = true;
          let node = this.sectionNodes[line.source];
          if (node.isUsed === false) {
            node.isUsed = true;
            let childNode: SectionNode = {
              modelId: node.modelId,
              name: node.name,
              id: node.id,
              image: node.image,
              imageSelected: node.imageSelected,
              imageUp: node.imageUp,
              imageDown: node.imageDown,
              parent: parent,
              children: [],
              isUsed: false
            };
            children.push(childNode);
            this.createChildTreeNode(childNode.children, childNode, line.source, currentDepth);
          }

        }
      }


    }
  }

  public createSVG() {
    let height = this.domHandler.getHeight(this.contentElementRef.nativeElement);
    let width = this.domHandler.getWidth(this.contentElementRef.nativeElement);
    if (width === 0) {
      width = (window.innerWidth - 120) / 12 * 8;
    }
    if (height === 0) {
      height = window.innerHeight - 42;
    }
    this.svg = d3.select('#topology').append('svg')
      .attr('width', width)
      .attr('height', height);
    this.svg.append('rect')
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .attr('width', width)
      .attr('height', height)
      .call(d3.behavior.zoom()
        .scaleExtent([0.1, 2])
        .on('zoom', () => {
          this.zoomed();
        }));
    // this.svg.append('image')
    //   .attr('width', 150)
    //   .attr('height', 400)
    //   .attr('fill', 'red')
    //   .attr('xlink:href', () => {
    //     return this.artboard;
    //   })
    //   .attr('x', () => {
    //     return 50;
    //   })
    //   .attr('y', () => {
    //     return 0;
    //   });
  }

  public zoomed() {
    this.group.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
  }

  public createGroup() {
    let width = window.innerWidth * 2;
    let height = window.innerHeight * 5 - 40;
    this.zoom = d3.behavior.zoom()
      .scaleExtent([0.1, 2])
      .on('zoom', () => {
        this.zoomed();
      });


    this.group = this.svg.append('g');
    // .attr("transform", function(d) { return "translate(" + d + ")"; });
    // .call(this.zoom);

    // this.group.append("rect")
    //   .attr("fill", "none")
    //   .attr("pointer-events", "all")
    //   .attr("width", width)
    //   .attr("height", height);
  }

  public createArrow() {
    let defs = this.group.append('defs');

    let arrowMarker = defs.append('marker')
      .attr('id', 'arrow')
      .attr('markerUnits', 'strokeWidth')
      .attr('markerWidth', '4')
      .attr('markerHeight', '4')
      .attr('viewBox', '0 0 12 12')
      .attr('refX', '6')
      .attr('refY', '6')
      .attr('orient', 'auto');

    let arrowRedMarker = defs.append('marker')
      .attr('id', 'arrowRed')
      .attr('markerUnits', 'strokeWidth')
      .attr('markerWidth', '4')
      .attr('markerHeight', '4')
      .attr('viewBox', '0 0 12 12')
      .attr('refX', '6')
      .attr('refY', '6')
      .attr('orient', 'auto');

    arrowRedMarker.append('path')
      .attr('d', this.arrow_path)
      .attr('fill', 'red');
    arrowMarker.append('path')
      .attr('d', this.arrow_path)
      .attr('fill', '#3399C5');
  }

  public createD3Nodes(nodes: any[]) {
    let img_w = 30;
    let img_h = 30;
    this.nodes_img = this.group.selectAll('image')
      .data(nodes)
      .enter()
      .append('image')
      .attr('cursor', 'pointer')
      .attr('width', (d) => {
        if (d.name === 'right' || d.name === 'left') {
          return 0;
        }
        return this.img_w;
      })
      .attr('height', (d) => {
        if (d.name === 'right' || d.name === 'left') {
          return 0;
        }
        return this.img_h;
      })
      .attr('fill', 'red')
      .attr('xlink:href', function (d) {
        return d.image;
      })
      .attr('x', (d) => {
        return (d.x - this.img_w / 2);
      })
      .attr('y', (d) => {
        return d.y - this.img_w / 2;
      }).on('mouseover', (d, i) => {
        if (d.id !== '') {
          this.nodes_text.style('fill-opacity', (text) => {
            if (d.id === text.id) {
              return 1.0;
            } else {
              return 0.0;
            }
          });
        }

      })
      .on('mouseout', (d, i) => {
        if (d.id !== '') {
          this.nodes_text.style('fill-opacity', () => {
            return 0.0;
          });
        }

      })
      .on('click', (d) => {
        this.clickNode(d);
      });
  }

  public createD3Lines(lines: any[]) {

    function calculateLocation(target, source) {
      let vector = {x: (source.x - 15) - (target.x - 15), y: source.y - target.y};
      let dist = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
      if (dist === 0) {
        return {
          outSource: {x: source.x, y: source.y},
          outTarget: {x: target.x, y: target.y}
        };
      } else {
        let normalSourceVector = {x: vector.x / dist * 20, y: vector.y / dist * 20};
        let normalTargetVector = {x: vector.x / dist * 20, y: vector.y / dist * 20};
        return {
          outSource: {x: source.x - normalSourceVector.x, y: source.y - normalSourceVector.y},
          outTarget: {x: target.x + normalTargetVector.x, y: target.y + normalTargetVector.y}
        };
      }
    }

    this.node_link = this.group.selectAll('line')
      .data(lines)
      .enter()
      .append('line')
      .attr('cursor', 'pointer')
      .attr('x1', function (d) {
        let position = calculateLocation(d.target, d.source);
        return position.outSource.x;
      }).attr('y1', function (d) {
        let position = calculateLocation(d.target, d.source);
        return position.outSource.y;
      }).attr('x2', function (d) {
        let position = calculateLocation(d.target, d.source);
        return position.outTarget.x;
      }).attr('y2', function (d) {
        let position = calculateLocation(d.target, d.source);
        return position.outTarget.y;
      }).attr('id', (d) => {
        return d.source.id + '^' + d.target.id;
      })
      .style('stroke', '#3399C5')
      .style('stroke-width', 2)
      .style('stroke-dasharray', '5,5')
      .style('d', 'M5 20 l215 0')
      .attr('marker-end', 'url(#arrow)')
      .on('click', (d) => {
        this.lineClick(d);
      });
  }

  public lineClick(event) {
    let targetIds = [];
    if (this.elementId2InConnection.has(event.target.id)) {
      targetIds.push(...this.elementId2InConnection.get(event.target.id));
    }
    if (this.elementId2OutConnection.has(event.target.id)) {
      targetIds.push(...this.elementId2OutConnection.get(event.target.id));
    }
    if (this.elementId2BidirectionalConnection.has(event.target.id)) {
      targetIds.push(...this.elementId2BidirectionalConnection.get(event.target.id));
    }
    let sourceIds = [];
    if (this.elementId2InConnection.has(event.source.id)) {
      sourceIds.push(...this.elementId2InConnection.get(event.source.id));
    }
    if (this.elementId2OutConnection.has(event.source.id)) {
      sourceIds.push(...this.elementId2OutConnection.get(event.source.id));
    }
    if (this.elementId2BidirectionalConnection.has(event.source.id)) {
      sourceIds.push(...this.elementId2BidirectionalConnection.get(event.source.id));
    }
    let id = '';
    for (let targetId of targetIds) {
      for (let sourceId of sourceIds) {
        if (sourceId === targetId) {
          id = event.source.modelId + '^' + sourceId;
          break;
        }
      }
      if (id !== '') {
        break;
      }
    }
    if (id !== '') {
    }
  }

  public getLineIds(lines) {
    let ids = [];
    for (let line of lines) {
      let targetIds = [];
      if (this.elementId2InConnection.has(line.target.id)) {
        targetIds.push(...this.elementId2InConnection.get(line.target.id));
      }
      if (this.elementId2OutConnection.has(line.target.id)) {
        targetIds.push(...this.elementId2OutConnection.get(line.target.id));
      }

      if (this.elementId2BidirectionalConnection.has(line.target.id)) {
        targetIds.push(...this.elementId2BidirectionalConnection.get(line.target.id));
      }

      let sourceIds = [];
      if (this.elementId2InConnection.has(line.source.id)) {
        sourceIds.push(...this.elementId2InConnection.get(line.source.id));
      }
      if (this.elementId2OutConnection.has(line.source.id)) {
        sourceIds.push(...this.elementId2OutConnection.get(line.source.id));
      }
      if (this.elementId2BidirectionalConnection.has(line.source.id)) {
        sourceIds.push(...this.elementId2BidirectionalConnection.get(line.source.id));
      }
      let id = '';
      for (let targetId of targetIds) {
        for (let sourceId of sourceIds) {
          if (sourceId === targetId) {
            id = line.source.modelId + '^' + sourceId;
            break;
          }
        }
        if (id !== '') {
          break;
        }
      }
      if (id !== '') {
        ids.push(id);
      }
    }
    return ids;
  }

  public createD3NodeText(nodes: any[]) {
    let text_dx = 20;
    let text_dy = 20;
    this.nodes_text = this.group.selectAll('.nodetext')
      .data(nodes)
      .enter()
      .append('text')
      .attr('class', 'nodetext')
      .attr('x', function (d) {
        return d.x + text_dx;
      })
      .attr('y', function (d) {
        return d.y + text_dy;
      })
      .text(function (d) {
        return d.name;
      }).attr('id', function (d) {
        return d.id;
      }).style('fill-opacity', () => {
        return 0.0;
      });
  }

  public getParentNodeIds(node: SectionNode) {
    if (node.parent !== null) {
      this.parentNodeIds.push(node.parent.id);
      this.getParentNodeIds(node.parent);
    }
  }

  public getChildrenNodeIds(node: SectionNode) {
    if (node.children !== undefined && node.children.length > 0) {
      for (let child of node.children) {
        this.childrenNodeIds.push(child.id);
        this.getChildrenNodeIds(child);
      }
    }
  }

  public contextMenu(event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    return false;
  }
}
