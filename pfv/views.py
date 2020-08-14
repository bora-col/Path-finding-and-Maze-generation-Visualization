import json
import sys
import os
dir_path = os.path.dirname(os.path.realpath(__file__))
sys.path.append(dir_path)
from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from utility_methods import shortestPathSetup, shortestPath, addEdge, getNeighbours, createMaze




# Create your views here.

@csrf_protect
def home(request):
    
    if request.method == 'POST':
        values = request.POST.get('values', -1)
        values_dict = json.loads(values)
        row_count = int(values_dict['row_count'])
        col_count = int(values_dict['col_count'])
        if(values_dict["request_for"]==1):
            walls = values_dict['walls']
            adjs = shortestPathSetup(row_count, col_count, walls)
            src = int(values_dict['start'])
            end = int(values_dict['end'])
            all_paths, seek_list = shortestPath(adjs, row_count*col_count, src, end)
            shortest_path = all_paths[end]
            context = {
                'shortest_path': shortest_path,
                'seek_list': seek_list
            }
            return HttpResponse(json.dumps(context), content_type = 'application/json')

        else:
            maze = createMaze(col_count, row_count)
            context = {
                'maze': maze
            }
            return HttpResponse(json.dumps(context), content_type = 'application/json')

        
    return render(request, 'pfv/home.html')


