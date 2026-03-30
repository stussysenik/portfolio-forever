-- Wanderer: pixel creature that drifts around, reacts to scroll
function update(dt, self, ctx)
  -- Drift with slight randomness
  local vx = self.vx + (math.random() - 0.5) * 30 * dt
  local vy = self.vy + (math.random() - 0.5) * 20 * dt

  -- Scroll pushes creatures sideways
  vx = vx + ctx.scrollVelocity * 0.3

  -- Dampen
  vx = vx * 0.98
  vy = vy * 0.98

  -- Clamp speed
  local maxSpeed = 60
  if math.abs(vx) > maxSpeed then vx = maxSpeed * (vx > 0 and 1 or -1) end
  if math.abs(vy) > maxSpeed then vy = maxSpeed * (vy > 0 and 1 or -1) end

  return {
    x = self.x + vx * dt,
    y = self.y + vy * dt,
    vx = vx,
    vy = vy
  }
end
