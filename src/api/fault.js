
export function eventQuery(query) {
  return request({
    url: '/fault/event',
    method: 'get',
    params: query
  })
}

export function repairManQuery(query) {
  return request({
    url: '/fault/peopleList',
    method: 'get',
    params: query
  })
}

export function fetchRepairman(uid) {
  return request({
    url: '/fault/repairman',
    method: 'get',
    params: { uid }
  })
}
