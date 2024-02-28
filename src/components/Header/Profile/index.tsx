import { StyledAvatarRoot, StyledAvatarImage ,StyledAvatarFallback} from './styles'
export function Profile() {
  return (
    <div>
      <StyledAvatarRoot className="AvatarRoot">
        <StyledAvatarImage
          className="AvatarImage"
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
          alt="Colm Tuite"
        />
        <StyledAvatarFallback className="AvatarFallback" delayMs={600}>
          CT
        </StyledAvatarFallback>
      </StyledAvatarRoot>
    </div>
  );
}