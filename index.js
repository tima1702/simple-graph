// const _ = require('underscore');

const createEmptyMap = (count) => {
  const result = new Map();
  _.range(1, +count + 1).forEach(i => result.set(i, []));
  return result;
};


// content:
// 15
// 15 1
// 9 9
// 4 15
// 15 4
// 3 15
// 5 13
//  строит список смежности
const createAdjacencyList = (content) => {
  const count = content.split('\n')[0];
  const adjacencyList = createEmptyMap(count);

  content.split('\n').forEach((row) => {
    const [a, b] = row.split(/\s/);

    if (a && b) {
      adjacencyList.get(+a).push(+b);
      if (a !== b) {
        // при необходимости раскоментировать
        adjacencyList.get(+b).push(+a);
      }
    }
  });

  return adjacencyList;
};


const createEmptyMatrix = (rows, columns = 0) => {
  const arr = [];
  for (let i = 0; i < rows; i += 1) {
    arr[i] = [];
    for (let j = 0; j < columns; j += 1) {
      arr[i][j] = 0;
    }
  }
  return arr;
};

// context - содержимое файла
// Построить и вывести на экран матрицу смежности.
// возвращяет матрицу смежности
const stringToAdjacencyMatrix = (context) => {
  const count = context.split('\n')[0];
  const adjacencyMatrix = createEmptyMatrix(count, count);

  context.trim().split('\n').forEach((row) => {
    const [a, b] = row.split(/\s/);

    if (a && b) {
      adjacencyMatrix[a - 1][b - 1] = 1;
      adjacencyMatrix[b - 1][a - 1] = 1;
    }
  });

  return adjacencyMatrix;
};

// context - содержимое файла
// Определить степени всех вершин и вывести список вершин с их степенями.
// возвращяет Map где key - спискок вершин, value - степень вершины
const getDegreesOfVertices = (context) => {
  const result = new Map();
  createAdjacencyList(context).forEach((value, key) => result.set(key, value.map(i => i.length)));
  return result;
};

// context - содержимое файла
// Определить изолированные вершины и вывести их список.
// возвращяет массив изолированных вершин
const getIsolatedVertices = (context) => {
  const result = [];
  createAdjacencyList(context).forEach((item, index) => item.length === 0 && result.push(index));
  return result;
};

// context - содержимое файла
// Определить висячие вершины и вывести их список.
// возвращяет массив висячиx вершин
const getPendantVertices = (context) => {
  const result = [];
  createAdjacencyList(context)
    .forEach((item, index) => item.length === 1 && item[0] !== index && result.push(index));
  return result;
};

// context - содержимое файла
// Определить висячие ребра и вывести их список.
// возвращяет массив висячиx ребер
const getPendantVerges = (context) => {
  const result = [];
  createAdjacencyList(context).forEach((item, index) => {
    if (item.length === 1 && item[0] !== index) result.push([item[0], index]);
  });
  return result;
};

// context - содержимое файла
// Определить вершины, в которых имеются петли, и вывести список таких вершин с кратностями петель.
// возвращяет массив объектов
const getLoops = (context) => {
  const result = [];
  createAdjacencyList(context).forEach((item, index) => {
    const loops = item.filter(i => i === index);
    if (loops.length > 0) {
      result.push({ 'вершина': index, 'кратность': loops.length });
    }
  });
  return result;
};

// context - содержимое файла
// кратные ребра и выводит их список с кратностями
// возвращяет массив объектов
const getMultipleVerges = (context) => {
  const result = [];
  createAdjacencyList(context).forEach((item, index) => {
    const arr = [...new Set(item)];
    arr.forEach((i) => {
      const count = item.filter(a => a === i).length;
      result.push({'ребро': `${i}, ${index}`,'кратность': count});
    });
  });
  return result;
};

// Приводит исходный граф к форме простого графа:
// удаляет петли и для кратных ребер оставляет только одно ребро.
// Для преобразованного графа выводит списки смежности
// возвращяет список смежности
const graphToSimpleForm = (context) => {
  const result = new Map();
  createAdjacencyList(context).forEach((row, index) => {
    const array = row.filter(item => item !== index);
    result.set(index, [...new Set(array)]);
  });
  return result;
};

// context - содержимое файла
// Определяет количество компонент связности преобразованного графа
// выводит на экран состав каждой компоненты в форме списка входящих в компоненту вершин
// Возвращяет массивы вершин
const findComponentOfTheTransformedGraph = (context) => {
  const result = [];
  const simpleForm = graphToSimpleForm(context);
  graphToSimpleForm(context).forEach((array, index) => {
    if (_.flatten(result).indexOf(index) === -1) {
      let preResult = _.uniq([index, ...array]);
      preResult.forEach(i => preResult.push(simpleForm.get(i)));
      preResult = _.uniq(_.flatten(preResult));
      let isNew = true;
      result.forEach((s, i1) => {
        s.forEach((t) => {
          if (preResult.indexOf(t) !== -1) {
            result[i1] = _.uniq([...preResult, ...s]);
            isNew = false;
          }
        });
      });
      if (isNew) {
        result.push(preResult);
      }
    }
  });
  return result;
};

const colors = [
  '#FF0000',
  '#7CFC00',
  '#00FA9A',
  '#006400',
  '#FF1493',
  '#FF4500',
  '#FFFF00',
  '#00FFFF',
  '#4682B4',
  '#EE82EE',
  '#000080',
  '#4B0082',
  '#000000',
  '#ffffff',
  '#8B4513',
  '#556B2F',
];

// context - содержимое файла
// Вершинная раскраска и хроматическое число для графа в 16-ти цветовой палитре
// возвращяет хроматическое число и Map где key - вершина, value - цвет вершины
const colorNodesAndChrome = (context) => {
  const resultColoring = new Map();
  let ghrome = 0;
  createAdjacencyList(context).forEach((items, index) => {
    let colorIndex = 0;
    items.forEach(item => {
      if (resultColoring.get(item) && colors.findIndex(c => c === resultColoring.get(item)) === colorIndex) {
        colorIndex += 1;
      }
    });
    ghrome = colorIndex > ghrome ? ghrome = colorIndex : ghrome;
    resultColoring.set(index, colors[colorIndex]);
  });
  return {result: resultColoring, ghrome: ghrome + 1}; // т.к. индекс
};

// context - содержимое файла
// Реберная раскраска и хроматический индекс для графа в 16-ти цветовой палитре
// возвращяет хроматическое число и Map где key - ребро, value - цвет ребра
const colorEdgesAndChrome = (context) => {
  const resultColoring = new Map();
  const list = createAdjacencyList(context);
  let ghrome = 0;
  createAdjacencyList(context).forEach((items, index) => {
    items.forEach(item => {
      if (!resultColoring.get(`${item}-${index}`)) {
        let listNames = [];
        // собираем возможные вариации названий ребер двух вершин
        if (list.get(item)) {
          const eges = [...list.get(item).map(i => {
            return `${item}-${i}`;
          }), ...list.get(item).map(i => {
            return `${i}-${item}`;
          })];
          listNames = [...eges, ...listNames];
        }
        if (list.get(index)) {
          const eges = [...list.get(index).map(i => {
            return `${index}-${i}`;
          }), ...list.get(index).map(i => {
            return `${i}-${index}`;
          })];
          listNames = [...eges, ...listNames];
        }
        let colorIndex = 0;
        let isTrue = true, massColorsIndexEdges = [];
        // собираем существующие цвета смежных ребер
        listNames.forEach(lItem => {
          if (resultColoring.get(lItem)) {
            massColorsIndexEdges.push(colors.findIndex(c => c === resultColoring.get(lItem)));
          }
        });
        // проверяем до тех пор пока не будет уникального цвета среди смежных ребер
        do {
          if (massColorsIndexEdges.findIndex(c => c === colorIndex) !== -1) {
            colorIndex += 1;
          } else {
            isTrue = false;
          }
        } while (isTrue);
        ghrome = colorIndex > ghrome ? ghrome = colorIndex : ghrome;
        resultColoring.set(`${index}-${item}`, colors[colorIndex]);
      }
    });
  });
  return {result: resultColoring, ghrome: ghrome + 1}; // т.к. индекс
};

// context - содержимое файла
// Получаем закрытый(замкнутый) маршрут, startNode - начальная вершина
// возвращяет закрытый(замкнутый) маршрут по вершинам
const closeRoute = (context, startNode) => {
  const resultRoute = [];
  const list = new Map(createAdjacencyList(context));
  let inFunction = false;
  resultRoute.push(startNode);
  function nextEpisode(itemsNext, goBack, lastIndex) {
    const index = Math.floor(Math.random() * itemsNext.length);
    const newItems = [...list.get(itemsNext[index])];
    if (resultRoute.length === 1 && resultRoute[0] === itemsNext[index]) {
      nextEpisode(itemsNext, false, lastIndex);
    }
      newItems.splice(newItems.indexOf(inFunction ? lastIndex : startNode), 1);
    inFunction = true;
    if (newItems.length) {
        resultRoute.push(itemsNext[index]);
      if (resultRoute.length > 1 && resultRoute[0] === resultRoute[resultRoute.length - 1]) {
        return resultRoute;
      }
      nextEpisode(newItems, false, itemsNext[index]);
    } else {
      if (!goBack) {
        resultRoute.push(itemsNext[index]);
      }
      resultRoute.splice(resultRoute.length / 2 ^ 0, resultRoute.length - (resultRoute.length / 2 ^ 0));
      nextEpisode(new Map(createAdjacencyList(context)).get(resultRoute[resultRoute.length - 1]), true);
    }
  }
  if (!inFunction) {
    nextEpisode(list.get(startNode));
  }
  return resultRoute;
};

// context - содержимое файла
// Получаем открытый маршрут, startNode - начальная вершина
// возвращяет открытый маршрут по вершинам
const openRoute = (context, startNode, approximateQuantity) => {
  const resultRoute = [];
  const list = createAdjacencyList(context);
  let inFunction = false;
  resultRoute.push(startNode);
  function nextEpisode(itemsNext, goBack, lastIndex) {
    const index = Math.floor(Math.random() * itemsNext.length);
    const newItems = [...list.get(itemsNext[index])];
    if (!goBack) {
      newItems.splice(newItems.indexOf(inFunction ? lastIndex : startNode), 1);
    }
    inFunction = true;
    if (newItems.length) {
      if (!goBack) {
        resultRoute.push(itemsNext[index]);
      }
      if (resultRoute.length >= approximateQuantity && resultRoute[0] !== resultRoute[resultRoute.length - 1]) {
        return resultRoute;
      }
      nextEpisode(newItems, false, itemsNext[index]);
    } else {
      if (!goBack) {
        resultRoute.push(itemsNext[index]);
      }
      if (itemsNext[index] === resultRoute[0]) {
        nextEpisode(itemsNext.splice(itemsNext.indexOf(itemsNext[index], 1)), true);
      } else {
        return resultRoute;
      }
    }
  }
  if (!inFunction) {
    nextEpisode(list.get(startNode));
  }
  return resultRoute;
};

// context - содержимое файла
// Получаем цепь, startNode - начальная вершина
// возвращяет цепь
const getTrail = (context, startNode, approximateQuantity) => {
  const resultRoute = [];
  const list = createAdjacencyList(context);
  let inFunction = false;
  resultRoute.push(startNode);
  function nextEpisode(itemsNext, goBack, lastIndex) {
    const index = Math.floor(Math.random() * itemsNext.length),
    lItem = itemsNext[index];
    const newItems = list.get(itemsNext[index]);
    newItems.splice(newItems.indexOf(inFunction ? lastIndex : startNode), 1);
    itemsNext.splice(index, 1);
    inFunction = true;
    if (newItems.length) {
      resultRoute.push(lItem);
      if (resultRoute.length === approximateQuantity) {
        return resultRoute;
      }
      nextEpisode(newItems, false, lItem);
    } else {
      return resultRoute;
    }
  }
  if (!inFunction) {
    nextEpisode(list.get(startNode));
  }
  return resultRoute;
};

// context - содержимое файла
// Получаем путь, startNode - начальная вершина
// возвращяет путь
const getWay = (context, startNode, approximateQuantity) => {
  const resultRoute = [];
  const list = createAdjacencyList(context);
  let inFunction = false;
  resultRoute.push(startNode);
  function nextEpisode(itemsNext, goBack, lastIndex) {
    const index = Math.floor(Math.random() * itemsNext.length),
      lItem = itemsNext[index];
    if (resultRoute.indexOf(lItem) !== -1) {
      itemsNext.splice(index, 1);
      if (itemsNext.length) {
        nextEpisode(itemsNext, false, lastIndex);
      }
      return resultRoute;
    }
    const newItems = list.get(itemsNext[index]);
    newItems.splice(newItems.indexOf(inFunction ? lastIndex : startNode), 1);
    itemsNext.splice(index, 1);
    inFunction = true;
    if (newItems.length) {
      resultRoute.push(lItem);
      if (resultRoute.length === approximateQuantity) {
        return resultRoute;
      }
      nextEpisode(newItems, false, lItem);
    } else {
      return resultRoute;
    }
  }
  if (!inFunction) {
    nextEpisode(list.get(startNode));
  }
  return resultRoute;
};

// context - содержимое файла
// Получаем контур, startNode - начальная вершина
// возвращяет контур
const getCircuit = (context, startNode) => {
  let resultRoute = [];
  let list = createAdjacencyList(context);
  let inFunction = false;
  resultRoute.push(startNode);
  function nextEpisode(itemsNext, goBack, lastIndex) {
    const index = Math.floor(Math.random() * itemsNext.length),
      lItem = itemsNext[index];
    const newItems = list.get(itemsNext[index]);
    newItems.splice(newItems.indexOf(inFunction ? lastIndex : startNode), 1);
    itemsNext.splice(index, 1);
    inFunction = true;
    if (newItems.length) {
      resultRoute.push(lItem);
      if (resultRoute[0] === lItem && resultRoute.length > 3) {
        return resultRoute;
      }
      nextEpisode(newItems, false, lItem);
    } else {
      if (resultRoute[0] === lItem) {
        resultRoute.push(lItem);
        return resultRoute;
      } else {
        resultRoute = [startNode];
        // темное колдунство
        list = new Map([...createAdjacencyList(context)]);
        nextEpisode(list.get(startNode), false, startNode);
      }
    }
  }
  if (!inFunction && list.size > 2) {
    nextEpisode(list.get(startNode));
  }
  return resultRoute;
};

// context - содержимое файла
// Получаем контур, startNode - начальная вершина
// возвращяет контур
const getEasyCycle = (context, startNode) => {
  let resultRoute = [];
  let list = createAdjacencyList(context);
  let inFunction = false;
  resultRoute.push(startNode);
  function nextEpisode(itemsNext, goBack, lastIndex) {
    const index = Math.floor(Math.random() * itemsNext.length),
      lItem = itemsNext[index];
    if (resultRoute.indexOf(lItem) !== -1) {
      console.log(index, lItem, itemsNext, resultRoute);
      itemsNext.splice(index, 1);
      if (itemsNext.length) {
        nextEpisode(itemsNext, false, lastIndex);
      } else {
        console.log('reset');
        resultRoute = [startNode];
        // темное колдунство
        list = new Map([...createAdjacencyList(context)]);
        nextEpisode(list.get(startNode), false, startNode);
      }
    }
    const newItems = list.get(itemsNext[index]);
    newItems.splice(newItems.indexOf(inFunction ? lastIndex : startNode), 1);
    itemsNext.splice(index, 1);
    inFunction = true;
    if (newItems.length) {
      resultRoute.push(lItem);
      if (resultRoute[0] === lItem && resultRoute.length > 3) {
        return resultRoute;
      }
      nextEpisode(newItems, false, lItem);
    } else {
      if (resultRoute[0] === lItem) {
        resultRoute.push(lItem);
        return resultRoute;
      } else {
        resultRoute = [startNode];
        // темное колдунство
        list = new Map([...createAdjacencyList(context)]);
        nextEpisode(list.get(startNode), false, startNode);
      }
    }
  }
  if (!inFunction && list.size > 2) {
    nextEpisode(list.get(startNode));
  }
  return resultRoute;
};

// export {
//   // createAdjacencyList,
//   stringToAdjacencyMatrix,
//   getDegreesOfVertices,
//   getIsolatedVertices,
//   getPendantVertices,
//   getLoops,
//   getMultipleVerges,
//   graphToSimpleForm,
//   findComponentOfTheTransformedGraph,
//   colorNodesAndChrome,
//   colorEdgesAndChrome,
// };
