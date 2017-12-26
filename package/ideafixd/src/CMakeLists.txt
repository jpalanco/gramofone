cmake_minimum_required(VERSION 2.6)

PROJECT(ideafixd C)
ADD_DEFINITIONS(-Os -ggdb -Wall -Werror --std=gnu99 -Wmissing-declarations)

SET(CMAKE_SHARED_LIBRARY_LINK_C_FLAGS "")

IF(APPLE)
  INCLUDE_DIRECTORIES(/opt/local/include)
  LINK_DIRECTORIES(/opt/local/lib)
ENDIF()

SET(SOURCES ideafixd.c ubus.c service/service.c service/instance.c
	service/trigger.c service/validate.c md5.c utils/utils.c watchdog.c)

find_library(json NAMES json-c json)
SET(LIBS ubox ubus ${json} blobmsg_json json_script uceasy)

IF(DEBUG)
  ADD_DEFINITIONS(-DDEBUG -g3)
ENDIF()


ADD_EXECUTABLE(ideafixd ${SOURCES})
TARGET_LINK_LIBRARIES(ideafixd ${LIBS})
INSTALL(TARGETS ideafixd
	RUNTIME DESTINATION sbin
)
