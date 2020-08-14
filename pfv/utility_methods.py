import heapq
import random
import sys


def shortestPathSetup(row,col,walls):
    INF = sys.maxsize
    V = row * col
    walls_set = set()
    for wall_cell in walls:
        walls_set.add(int(wall_cell))

    adjs = []

    for v in range(V):
        adjs.append([])

    weight = 0
    for i in range(V):
        weight = INF if i in walls_set else 1
        if((i % col)-1 >= 0):
            if i-1 not in walls_set:
                addEdge(adjs, i-1, i, weight)
        if((i % col)+1 < col):
            if i+1 not in walls_set:
                addEdge(adjs, i+1, i, weight)
        if(i-col >= 0):
            if i-col not in walls_set:
                addEdge(adjs, i-col, i, weight)
        if(i+col <= V-1):
            if i+col not in walls_set:
                addEdge(adjs, i+col, i, weight)
        
    return adjs

# // To add an edge
def addEdge(adjs, u, v, wt):
    adjs[u].append([v, wt])
    adjs[v].append([u, wt])
   
  
# // Prints shortest paths from src to all other vertices
def shortestPath(adjs, V, src, end):
    INF = sys.maxsize
    pq = []
    heapq.heapify(pq)
    parent_list = [-1] * V
    all_paths = []
    heap_pop_list = []
    end_popped = False


    dist = [INF for x in range(V)]

    heapq.heappush(pq, [0, src]) # [dist, dest]
    dist[src] = 0

    while (len(list(pq))):
        pq_top = heapq.heappop(pq)
        u = pq_top[1]
        if u == end:
            end_popped = True
        if not end_popped:
            heap_pop_list.append(u)
        for x in adjs[u]:
            v = x[0]
            weight = x[1]
            if dist[v] > dist[u] + weight:
                parent_list[v] = u
                dist[v] = dist[u] + weight
                heapq.heappush(pq,[dist[v], v])
  
    # // Print shortest distances stored in dist[]
    # print()
    # print()
    # print("From", '\t', "To", '\t', "Distance", '\t', "Path")
    for i in range(V):
        # print(src, '\t', i, '\t', dist[i], end='')

        #print path from src to i
        parent = parent_list[i]
        path = []
        while(parent != -1):
            path.insert(0,parent)
            parent = parent_list[parent]
            if parent == src:
                break
        all_paths.append(path)
        # print("\t\t", path)
    
    return all_paths, heap_pop_list





def getNeighbours(index, visited, w, h):
    top = index - 2*w
    right = index + 2
    bottom = index + 2*w
    left = index - 2
    neighbours = []
    if(top > 0 and (top not in visited)):
        neighbours.append((top, index-w))
    if(right % w not in [0,1] and (right not in visited)):
        neighbours.append((right, index+1))
    if(bottom < h*w and (bottom not in visited)):
        neighbours.append((bottom, index+w))
    if(left % w not in [w-2,w-1] and (left not in visited)):
        neighbours.append((left, index-1))

    return neighbours



def createMaze(w, h):
    maze = []
    visited = set()
    c = 0
    r = 0
    index = c + r * w
    maze.append(index)
    stack = []
    stack.append(index)
    visited.add(index)
    while len(stack) > 0:
        neighbours = getNeighbours(index,visited,w,h)
        while(len(neighbours)==0):
            if(len(stack)==0):
                return maze
            index = stack.pop()
            neighbours = getNeighbours(index,visited,w,h)
        neig_index = random.randint(0,len(neighbours)-1)
        neighbour = neighbours[neig_index]
        index = neighbour[0]
        index_between = neighbour[1]
        maze.append(index)
        maze.append(index_between)
        visited.add(index)
        visited.add(index_between)
        neighbours.clear()
        stack.append(index)
    return maze
