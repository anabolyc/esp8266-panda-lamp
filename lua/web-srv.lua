local M = {};

local started = false;
local state   = false;
local pin_sw  = 0;

local OK = function(content)
    local s = "HTTP/1.1 200 OK\r\n";
    if (content) then s = s.."Content-type: application/json\r\n"; end
    s = s.."Connection: close\r\n\r\n";
    if (content) then s = s..content; end
    return s;
end

local FAIL = function()
    return "HTTP/1.1 404 Not Found\r\n".."Connection: close\r\n\r\n";
end

local on = function(PIN_SW)
    gpio.write(pin_sw, gpio.LOW);
    state = true;
end

local off = function(PIN_SW)
    gpio.write(pin_sw, gpio.HIGH);
    state = false;
end

M.start = function(_port, PIN_SW) 
    if started then
        print("Warning: server already started, exiting...");
        return;
    end

    gpio.mode(PIN_SW, gpio.OUTPUT);
    pin_sw = PIN_SW;
    
    print("Listenting on ", _port);
    srv = net.createServer(net.TCP);
    srv:listen(_port, function(conn)
        
        conn:on("receive", function(sck, request)
            --print(request);
            local _, __, method, path = string.find(request, "([A-Z]+) (.-) HTTP");
            
            print(method, path);
            
            local buf = "";
            if (path == "/on") and (method == "POST") then
                on();
                buf = OK();
            elseif (path == "/off") and (method == "POST") then
                off();
                buf = OK();
            elseif (path == "/toggle") and (method == "POST") then
                if (state == true) then off(); else on(); end
                buf = OK("{state:"..(state and "true" or "false").."}");
            elseif (path == "/state") and (method == "GET") then
                print("state: ", state); 
                buf = OK("{state:"..(state and "true" or "false").."}");
            else
                buf = FAIL();
            end
--        buf = "HTTP/1.1 405 Method Not Allowed\r\n";
--        buf = buf.."Allow:HEAD,GET\r\n";
--        buf = buf.."Connection: close\r\n\r\n";

            conn:send(buf, function()
                sck:close();
                collectgarbage();
            end);
        end)
    end);
    started = true;
end

return M;
