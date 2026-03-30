-- Electron: orbits in elliptical path, scatters when mouse is near
function update(dt, self, ctx)
  -- Orbit center
  local cx = ctx.viewportW * 0.5
  local cy = ctx.viewportH * 0.3

  -- Elliptical orbit
  local angle = (self.x / ctx.viewportW) * 6.28318 + dt * 2.0
  local rx = ctx.viewportW * 0.25
  local ry = ctx.viewportH * 0.15

  local tx = cx + math.cos(angle) * rx
  local ty = cy + math.sin(angle) * ry

  -- Mouse repulsion
  local dx = self.x - ctx.mouseX
  local dy = self.y - ctx.mouseY
  local dist = math.sqrt(dx * dx + dy * dy)
  local repelX, repelY = 0, 0
  if dist < 120 and dist > 0 then
    local force = (120 - dist) / 120 * 200
    repelX = (dx / dist) * force * dt
    repelY = (dy / dist) * force * dt
  end

  return {
    x = tx + repelX,
    y = ty + repelY,
    vx = self.vx * 0.95,
    vy = self.vy * 0.95
  }
end
